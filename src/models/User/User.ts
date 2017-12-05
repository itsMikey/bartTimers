import {Document, Model, model, Schema} from "mongoose";
import {IRegisterApiReq} from "../../common/api/register/IRegisterApiReq";
import * as bcrypt from "bcryptjs";
import {IBartStation} from "../BartStation/BartStation";
import {IApiAddUserStations} from "../../common/constant/interfaces/bart/Station/IApiAddUserStation";
import {SUCCESS_CODES} from "../../common/constant/success-codes";
import {ERROR_CODES} from "../../common/constant/error-codes";
const SALT_ROUNDS: number = 12;

export interface IUser extends Document {
    firstName?: string;
    lastName?: string;
    email: string;
    password: string;
    devices?: Array<{ token: string; name: string, uniqueId: string }>;
    loggedIn?: boolean;
    stations?: {
        homeStation: IBartStation,
        homeStationArrival: string,
        destinationArrival: string,
        destinationStation: IBartStation
    };
    created_at: Date;
    updated_at: Date;
    lastLogin: Date;
}

const schema: Schema = new Schema({
    firstName: {type: String},
    lastName: {type: String},
    email: {"type": String, lowercase: true, unique: true, required: true},
    password: {"type": String},
    devices: {"type": Array},
    stations: {
        homeStation: {type: Schema.Types.ObjectId, ref: "BartStation", "default": null},
        homeStationArrival: {"type": String, "default": null},
        destinationArrival: {"type": String, "default": null},
        destinationStation: {type: Schema.Types.ObjectId, ref: "BartStation", "default": null}
    },
    lastLogin: {"type": Date, "default": Date.now}
}, {timestamps: {createdAt: "created_at", updatedAt: "updated_at"}});


schema.statics.addStations = (addStationReq: IApiAddUserStations): Promise<string> => {
    // add stations to user obj
    return User.findById(addStationReq.userSession._id)
        .then((user) => {
            user.stations = addStationReq.data.stations;
            user.updated_at = new Date(Date.now());
            user.markModified("stations");
            return user.save()
                .then(() => {
                    return Promise.resolve(SUCCESS_CODES.BART_STATION.USER_STATION_ADDED);
                })
                .catch((err) => {
                    console.log(err);
                    return Promise.reject(err);
                });
        })
        .catch((err) => {
            console.log(err);
            return Promise.reject(err);
        });
};

schema.statics.register = (registerReq: IRegisterApiReq): Promise<IUser> => {
    return new Promise((resolve, reject) => {
        if (typeof registerReq.data.email === "undefined" ||  typeof registerReq.data.password === "undefined") {
            return reject(ERROR_CODES.REGISTER.PARAMETERS_INVALID);
        } else {

            let newUser = {
                ...(registerReq.data.firstName) && {firstName: registerReq.data.firstName},
                ...(registerReq.data.lastName) && {lastName: registerReq.data.lastName},
                ...(registerReq.data.email) && {email: registerReq.data.email},
                password: registerReq.data.password
            };

            return User.findOne({email: newUser.email})
                .exec()
                .then((user) => {
                    if (!user) {
                        // encrypt the password
                        return encrypt(newUser.password)
                            .then((hash) => {
                                newUser.password = hash;
                                // save new user
                                return new User(newUser).save()
                                    .then((doc) => {
                                        return resolve(doc);
                                    });
                            });
                    } else {
                        return reject(ERROR_CODES.REGISTER.EMAIL_EXISTS);
                    }
                })
                .catch((err) => {
                    console.log(err);
                    return Promise.reject(err);
                });
        }
    }).catch((err) => {
        return Promise.reject(err);
    })  as Promise<IUser>;
};

// get only the fields we want for the client
schema.statics.getUserForClient = (userId: string): Promise<IUser> => {
    return User.findById(userId, "-_id firstName lastName email stations devices")
        .populate("stations.homeStation stations.destinationStation")
        .then((user) => {
            return Promise.resolve(user);
        })
        .catch((err) => {
            console.log(err);
            return Promise.reject(err);
        });
};

export interface IUserModel<T extends Document> extends Model<T> {
    _id: string;
    register(registerReq: IRegisterApiReq): Promise<IUser>;
    addStations(addStationReq: IApiAddUserStations): Promise<string>;
    getUserForClient(userId: string): Promise<IUser>;
}

// Call Schema Creation only if the model does not exist
export let User: IUserModel<IUser>;
try {
    User = model<IUser, IUserModel<IUser>>(
        "User");
} catch (error) {
    User = model<IUser, IUserModel<IUser>>(
        "User", schema);
}

export function encrypt(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS)
        .then((hash) => {
            return hash;
        });
}


export function doesPasswordMatch(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
        .then((match) => {
            return Promise.resolve(match);
        }).catch((err) => {
            console.log(err);
            return false;
        });
}
// for passport
export function syncDoesPasswordMatch(password: string, hash: string) {
    return bcrypt.compareSync(password, hash);
}
