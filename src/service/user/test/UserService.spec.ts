import {expect} from "chai";
import {mongooseHelper} from "../../../../test-helpers/MongooseHelper";
import {IUser, User} from "../../../models/User/User";
import {userRegistrationMocker} from "../../../../test-helpers/UserMocker";
import {Container} from "inversify";
import {MongooseService} from "../../dal/MongooseService";
import {UserService} from "../UserService";
import TYPES from "../../../common/constant/types";
import {AppConfigService} from "../../app-config/AppConfigService";
import {IApiAddUserStations} from "../../../common/constant/interfaces/bart/Station/IApiAddUserStation";
import {BartStation, IBartStation} from "../../../models/BartStation/BartStation";
import {mockApiBartStations} from "../../../../test-helpers/BartObjectsMocker";
import {SUCCESS_CODES} from "../../../common/constant/success-codes";
import {IStations} from "../../../common/constant/interfaces/bart/Station/IStations";

describe("User Service", () => {
    const testUserReq = userRegistrationMocker();
    const container = new Container();
    let addStationsReq: IApiAddUserStations;
    container.bind<AppConfigService>(TYPES.AppConfigService).to(AppConfigService);
    container.bind<MongooseService>(TYPES.MongooseService).to(MongooseService);
    container.bind<UserService>(TYPES.UserService).to(UserService);
    let userService: UserService = container.get(TYPES.UserService) as UserService;
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
                                userService.registerUser(testUserReq)
                                    .then((user) => {
                                        globalUser = user;
                                        addStationsReq = {
                                            userSession: {
                                                _id: globalUser._id,
                                                email: globalUser.email
                                            },
                                            data: {
                                                stations: {
                                                    homeStation: globalStations[1],
                                                    homeStationArrival: "05:00pm",
                                                    destinationArrival: "08:00am",
                                                    destinationStation: globalStations[5]
                                                } as IStations
                                            }
                                        };
                                        done();
                                    })
                                    .catch((err) => {
                                        console.log(err);
                                        return Promise.reject(err);
                                    });
                            });
                    });
            })
            .catch((err) => {
                console.log(err);
                return Promise.reject(err);
            });
    });

    after((done) => {
        container.unbindAll();
        Promise.all([
            BartStation.remove({}).exec(),
            User.remove({}).exec()
        ])
            .then(() => {
                mongooseHelper.closeConnection();
                done();
            })
            .catch((err) => {
                console.log(err);
                done(err);
            });
    });

    it("should have successfully registered user", (done) => {
        User.findById(globalUser._id)
            .then((user) => {
                expect(user.firstName, "incorrect firstName").to.eql(globalUser.firstName);
                expect(user.lastName, "incorrect lastName").to.eql(globalUser.lastName);
                expect(user.email, "incorrect email").to.eql(globalUser.email);
                expect(user.stations.destinationStation, "incorrect destinationStation").to.eql(globalUser.stations.destinationStation);
                expect(user.stations.destinationArrival, "incorrect destinationArrival").to.eql(globalUser.stations.destinationArrival);
                expect(user.stations.homeStationArrival, "incorrect destinationStation").to.eql(globalUser.stations.homeStationArrival);
                expect(user.stations.homeStation, "incorrect homeStation").to.eql(globalUser.stations.homeStation);
                done();
            })
            .catch((err) => {
                done(err);
            });
    });

    it("should add user stations", (done) => {

        userService.addUserStations(addStationsReq)
            .then((success) => {
                expect(success, "incorrect success code").to.eql(SUCCESS_CODES.BART_STATION.USER_STATION_ADDED);
                User.findById(globalUser._id)
                    .then((user) => {
                        expect(user.firstName, "incorrect firstName").to.eql(globalUser.firstName);
                        expect(user.lastName, "incorrect lastName").to.eql(globalUser.lastName);
                        expect(user.email, "incorrect email").to.eql(globalUser.email);
                        expect(user.stations.destinationStation, "incorrect destinationStation").to.eql(addStationsReq.data.stations.destinationStation._id);
                        expect(user.stations.destinationArrival, "incorrect destinationArrival").to.eql(addStationsReq.data.stations.destinationArrival);
                        expect(user.stations.homeStationArrival, "incorrect destinationStation").to.eql(addStationsReq.data.stations.homeStationArrival);
                        expect(user.stations.homeStation, "incorrect homeStation").to.eql(addStationsReq.data.stations.homeStation._id);
                        done();
                    })
                    .catch((err) => {
                        console.log(err);
                        done(err);
                    });
            })
            .catch((err) => {
                console.log(err);
                done(err);
            });
    });

    it("should get user facing client object", (done) => {
        userService.getUserForClient(globalUser._id)
            .then((clientUserFacingObj) => {
                expect(clientUserFacingObj.firstName, " incorrect firstName").to.eql(globalUser.firstName);
                expect(clientUserFacingObj.lastName, " incorrect lastName").to.eql(globalUser.lastName);
                expect(clientUserFacingObj.email, " incorrect email").to.eql(globalUser.email);
                expect(clientUserFacingObj.devices, " incorrect firstName").to.eql(globalUser.devices);
                expect(clientUserFacingObj.stations.destinationStation._id, "incorrect destinationStation").to.eql(addStationsReq.data.stations.destinationStation._id);
                expect(clientUserFacingObj.stations.destinationArrival, "incorrect destinationArrival").to.eql(addStationsReq.data.stations.destinationArrival);
                expect(clientUserFacingObj.stations.homeStationArrival, "incorrect destinationStation").to.eql(addStationsReq.data.stations.homeStationArrival);
                expect(clientUserFacingObj.stations.homeStation._id, "incorrect homeStation").to.eql(addStationsReq.data.stations.homeStation._id);
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
});

