import {Document, Model, model, Schema} from "mongoose";
import {IApiBartStation} from "../../common/constant/interfaces/bart/Station/IApiBartStation";
import {SUCCESS_CODES} from "../../common/constant/success-codes";

export interface IBartStation extends Document {
    name: string;
    abbr: string;
    location: number[];
    address: string;
    city: string;
    county: string;
    state: string;
    zipcode: number;
    created_at: Date;
    updated_at: Date;
}

const schema: Schema = new Schema({
        name: {"type": String},
        abbr: {"type": String, unique: true, required: true},
        location: {
            type: [Number],  // [<longitude>, <latitude>]
            index: "2d"      // create the geospatial index
        },
        address: {"type": String},
        city: {"type": String},
        county: {"type": String},
        state: {"type": String},
        zipcode: {"type": String}
    },
    {
        timestamps: {"createdAt": "created_at", "updatedAt": "updated_at"}
    });

// populate user's stations
schema.statics.addStations = (bartStations: IApiBartStation[]): Promise<string> => {
    let bulk = BartStation.collection.initializeUnorderedBulkOp();

    // for each station upsert/update
    for (let i = 0; i < bartStations.length; i++) {
        bulk.find({
            abbr: bartStations[i].abbr
        }).upsert().update(
            {
                $set: {
                    ...(bartStations[i].name) && {name: bartStations[i].name},
                    ...(bartStations[i].abbr) && {abbr: bartStations[i].abbr},
                    ...(bartStations[i].gtfs_longitude && bartStations[i].gtfs_latitude) && { location: [bartStations[i].gtfs_longitude, bartStations[i].gtfs_latitude]},
                    ...(bartStations[i].address) && {address: bartStations[i].address},
                    ...(bartStations[i].city) && {city: bartStations[i].city},
                    ...(bartStations[i].county) && {county: bartStations[i].county},
                    ...(bartStations[i].state) && {state: bartStations[i].state},
                    ...(bartStations[i].zipcode) && {zipcode: bartStations[i].zipcode}
                }
            });
    }

    return bulk.execute().then((docs) => {
        return Promise.resolve(SUCCESS_CODES.BART_STATION.API_STATIONS_POPULATED);
    })
        .catch((err) => {
            return Promise.reject(err);
        });
};

// all stations in mongo DB
schema.statics.getAllStations = (): Promise<IBartStation[]> => {
    return BartStation.find({}).exec();
};

// Model Interface
interface IBartStationModel<T extends Document> extends Model<T> {
    _id: string;
    addStations(bartStations: IApiBartStation[]): Promise<string>;
    getAllStations(): Promise<IBartStation[]>;
}

// Call Schema Creation only if the model does not exist
export let BartStation: IBartStationModel<IBartStation>;
try {
    BartStation = model<IBartStation, IBartStationModel<IBartStation>>(
        "BartStation");
} catch (error) {
    BartStation = model<IBartStation, IBartStationModel<IBartStation>>(
        "BartStation", schema);
}


