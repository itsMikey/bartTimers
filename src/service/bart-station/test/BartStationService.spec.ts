import {expect} from "chai";
import {mongooseHelper} from "../../../../test-helpers/MongooseHelper";
import {AppConfigService} from "../../app-config/AppConfigService";
import TYPES from "../../../common/constant/types";
import {MongooseService} from "../../dal/MongooseService";
import {BartStationService} from "../BartStationService";
import {Container} from "inversify";
import {BartStation} from "../../../models/BartStation/BartStation";
import {mockApiBartStations} from "../../../../test-helpers/BartObjectsMocker";
import {SUCCESS_CODES} from "../../../common/constant/success-codes";

describe("Bart Station Service", () => {
    const container = new Container();
    container.bind<AppConfigService>(TYPES.AppConfigService).to(AppConfigService);
    container.bind<MongooseService>(TYPES.MongooseService).to(MongooseService);
    container.bind<BartStationService>(TYPES.BartStationService).to(BartStationService);
    let bartStationService: BartStationService = container.get(TYPES.BartStationService) as BartStationService;

    before((done) => {
        mongooseHelper.createConnection();
        Promise.all([
            BartStation.remove({}).exec()
        ])
            .then(() => {
                done();
            })
            .catch((err) => {
                done(err);
            });
    });

    after((done) => {
        container.unbindAll();
        Promise.all([
            BartStation.remove({}).exec()
        ])
            .then(() => {
                mongooseHelper.closeConnection();
                done();
            })
            .catch((err) => {
                done(err);
            });
    });

    it("should add all stations to DB and then retrieve them using service", (done) => {
        bartStationService.addAllStationsToDb(mockApiBartStations)
            .then((successCode) => {
                expect(successCode, " incorrect success code").to.eql(SUCCESS_CODES.BART_STATION.API_STATIONS_POPULATED);
                bartStationService.getAllStations()
                    .then((dbStations) => {
                        for (let i = 0, j = dbStations.length; i < j; i++) {
                            expect(dbStations[i].abbr, "incorrect abbreviation").to.eql(mockApiBartStations[i].abbr);
                            expect(dbStations[i].name, "incorrect name").to.eql(mockApiBartStations[i].name);
                            expect(dbStations[i].address, "incorrect address").to.eql(mockApiBartStations[i].address);
                            expect(dbStations[i].county, "incorrect county").to.eql(mockApiBartStations[i].county);
                            expect(dbStations[i].state, "incorrect state").to.eql(mockApiBartStations[i].state);
                            expect(dbStations[i].zipcode, "incorrect zipcode").to.eql(mockApiBartStations[i].zipcode);
                        }
                        done();
                    })
                    .catch((err) => {
                        console.log(err);
                        done(err);
                    });
            })
            .catch((err) => {
                console.log(err);
                return Promise.reject(err);
            });
    });

});

