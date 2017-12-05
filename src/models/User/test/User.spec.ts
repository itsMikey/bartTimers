import {expect} from "chai";
import {mongooseHelper} from "../../../../test-helpers/MongooseHelper";
import {doesPasswordMatch, encrypt, IUser, syncDoesPasswordMatch, User} from "../User";
import {randomStringGenerator, userRegistrationMocker} from "../../../../test-helpers/UserMocker";
import {IRegisterApiReq} from "../../../common/api/register/IRegisterApiReq";
import {IApiAddUserStations} from "../../../common/constant/interfaces/bart/Station/IApiAddUserStation";
import {SUCCESS_CODES} from "../../../common/constant/success-codes";
import {BartStation, IBartStation} from "../../BartStation/BartStation";
import {mockApiBartStations} from "../../../../test-helpers/BartObjectsMocker";

describe("User", () => {
    const testUser: IRegisterApiReq = userRegistrationMocker();
    const testPassword: string = randomStringGenerator();
    let globalUser: IUser;
    let globalStations: IBartStation[];

    before((done) => {
        mongooseHelper.createConnection();
        Promise.all([
            BartStation.remove({}).exec(),
            User.remove({}).exec()
        ])
            .then(() => {
                BartStation.addStations(mockApiBartStations)
                    .then(() => {
                        BartStation.getAllStations()
                            .then((dbStations) => {
                                globalStations = dbStations;
                                done();
                            });
                    });
            })
            .catch((err) => {
                console.log(err);
                return Promise.reject(err);
            });
    });

    after((done) => {
        Promise.all([
            BartStation.remove({}).exec(),
            User.remove({}).exec()
        ]).then(() => {
            mongooseHelper.closeConnection();
            done();
        })
        .catch((err) => {
            console.log(err);
            return Promise.reject(err);
        });
    });

    it("should create a user", (done) => {
        User.register(testUser)
            .then(() => {
                User.findOne({"email": testUser.data.email})
                    .then((user) => {
                        globalUser = user;
                        expect(user.email, "incorrect email").to.eql(testUser.data.email);
                        expect(user.firstName, "incorrect firstName").to.eql(testUser.data.firstName);
                        expect(user.lastName, "incorrect lastName").to.eql(testUser.data.lastName);
                        expect(user.devices, "incorrect devices variable").to.eql([]);
                        doesPasswordMatch(testUser.data.password, user.password)
                            .then((isMatch) => {
                                expect(isMatch, "incorrect password").to.eql(true);
                                done();
                            })
                            .catch((err) => {
                                done(err);
                            });
                    })
                    .catch((err) => {
                        done(err);
                    });
            })
            .catch((err) => {
                done(err);
            });
    });

    // -_id firstName lastName email stations devices
    it("should get user facing client object", (done) => {
        User.getUserForClient(globalUser._id)
            .then((clientUserFacingObj) => {
                expect(clientUserFacingObj.firstName, " incorrect firstName").to.eql(globalUser.firstName);
                expect(clientUserFacingObj.lastName, " incorrect lastName").to.eql(globalUser.lastName);
                expect(clientUserFacingObj.email, " incorrect email").to.eql(globalUser.email);
                expect(clientUserFacingObj.devices, " incorrect firstName").to.eql(globalUser.devices);
                expect(clientUserFacingObj.stations.destinationStation, " incorrect destinationStation").to.eql(globalUser.stations.destinationStation);
                expect(clientUserFacingObj.stations.destinationArrival, " incorrect destinationArrival").to.eql(globalUser.stations.destinationArrival);
                expect(clientUserFacingObj.stations.homeStationArrival, " incorrect homeStationArrival").to.eql(globalUser.stations.homeStationArrival);
                expect(clientUserFacingObj.stations.homeStation, " incorrect homeStation").to.eql(globalUser.stations.homeStation);
                expect(clientUserFacingObj._id, " incorrect retrieved id").to.eql(undefined);
                expect(clientUserFacingObj.password, " incorrect retrieved password").to.eql(undefined);
                expect(clientUserFacingObj.created_at, " incorrect retrieved created_at").to.eql(undefined);
                expect(clientUserFacingObj.updated_at, " incorrect retrieved updated_at").to.eql(undefined);
                expect(clientUserFacingObj.lastLogin, " incorrect retrieved lastLogin").to.eql(undefined);
                done();
            })
            .catch((err) => {
                console.log(err);
                return Promise.reject(err);
            });
    });

    it("should successfully add user stations", (done) => {
        const addStationsReq: IApiAddUserStations = {
            userSession: {
                _id: globalUser._id,
                email: globalUser.email
            },
            data: {
                stations: {
                    homeStation: globalStations[0],
                    homeStationArrival: "05:00pm",
                    destinationArrival:  "08:00am",
                    destinationStation: globalStations[5]
                }
            }
        };
        User.addStations(addStationsReq)
            .then((successCode) => {
                expect(successCode, "wasn't successful in adding stations").to.eql(SUCCESS_CODES.BART_STATION.USER_STATION_ADDED);
                // get user to see if actually saved
                User.findById(globalUser._id)
                    .then((clientUserFacingObj: IUser) => {
                        console.log(clientUserFacingObj);
                        expect(clientUserFacingObj._id, "make sure got right user").to.eql(globalUser._id);
                        expect(clientUserFacingObj.stations.destinationStation, "incorrect destinationStation").to.eql(addStationsReq.data.stations.destinationStation._id);
                        expect(clientUserFacingObj.stations.destinationArrival, "incorrect destinationArrival").to.eql(addStationsReq.data.stations.destinationArrival);
                        expect(clientUserFacingObj.stations.homeStationArrival, "incorrect homeStationArrival").to.eql(addStationsReq.data.stations.homeStationArrival);
                        expect(clientUserFacingObj.stations.homeStation, "incorrect homeStation").to.eql(addStationsReq.data.stations.homeStation._id);
                        done();
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
    });

    it("compare password function should compare correct password", (done) => {
        encrypt(testPassword)
            .then((hashedPassword) => {
                doesPasswordMatch(testPassword, hashedPassword).then((match) => {
                    expect(match, "didn't successfully compare password").to.be.true;
                    done();
                });
            });
    });

    it("isolated compare password function should successfully compare correct password in the sync function", (done) => {
        encrypt(testPassword)
            .then((hashedPassword) => {
                    expect(syncDoesPasswordMatch(testPassword, hashedPassword), "didn't successfully compare password").to.be.true;
                    done();
            });
    });

    it("isolated compare password function should not return true to wrong password", (done) => {
        encrypt(testPassword)
            .then((hashedPassword) => {
                doesPasswordMatch("dummmyval", hashedPassword).then((match) => {
                    expect(match, "accepted wrong password").to.be.false;
                    done();
                });
            });
    });
    it("isolated sync compare password function should not return true to wrong password", (done) => {
        encrypt(testPassword)
            .then((hashedPassword) => {
                expect(syncDoesPasswordMatch("dummyval", hashedPassword), "accepted wrong password").to.be.false;
                done();
            });
    });

});

