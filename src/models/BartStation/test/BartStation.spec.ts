import {expect} from "chai";
import {mongooseHelper} from "../../../../test-helpers/MongooseHelper";
import {BartStation} from "../BartStation";
import {mockApiBartStations} from "../../../../test-helpers/BartObjectsMocker";

describe("Bart Stations", () => {

    before((done) => {
        mongooseHelper.createConnection();
        BartStation.remove({}).exec()
            .then(() => {
                done();
            })
            .catch((err) => {
                done(err);
            });
    });

    after((done) => {
        BartStation.remove({}).exec()
            .then(() => {
                mongooseHelper.closeConnection();
                done();
            })
            .catch((err) => {
                done(err);
            });
    });

    it("should store and get all Bart Stations", (done) => {
        BartStation.addStations(mockApiBartStations)
            .then(() => {
                BartStation.getAllStations()
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

