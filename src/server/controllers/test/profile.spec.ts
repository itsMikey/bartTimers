import chai = require("chai");
import {UserService} from "../../../service/user/UserService";
import TYPES from "../../../common/constant/types";
import {Container} from "inversify";
import {ApiHandlerService} from "../../../service/api-handler/ApiHandlerService";
import {MongooseService} from "../../../service/dal/MongooseService";
import {IUser, User} from "../../../models/User/User";
import {BartStation, IBartStation} from "../../../models/BartStation/BartStation";
import {mongooseHelper} from "../../../../test-helpers/MongooseHelper";
import {IProfileController, ProfileControllerFactory} from "../profile";
import {interfaces, TYPE} from "inversify-express-utils";
import {mockApiBartStations} from "../../../../test-helpers/BartObjectsMocker";
import {AppConfigService} from "../../../service/app-config/AppConfigService";
import {dbUserMock} from "../../../../test-helpers/UserMocker";
import {SUCCESS_CODES} from "../../../common/constant/success-codes";
import TAGS from "../tags";

const expect = chai.expect;


describe("Profile Controller", () => {
    let globalStations: IBartStation[];
    let globalUser: IUser;
    let container = new Container();
    container.bind<UserService>(TYPES.UserService).to(UserService);
    container.bind<AppConfigService>(TYPES.AppConfigService).to(AppConfigService);
    container.bind<ApiHandlerService>(TYPES.ApiHandlerService).to(ApiHandlerService);
    container.bind<MongooseService>(TYPES.MongooseService).to(MongooseService);
    let profileControllerFactory = ProfileControllerFactory(container);
    container.bind<interfaces.Controller>(TYPE.Controller).to(profileControllerFactory)
        .whenTargetNamed(TAGS.ProfileController);
    let profileController: IProfileController = container.getNamed(TYPE.Controller, TAGS.ProfileController) as IProfileController;
    // let hintMockService: HintMockService = container.get(TYPES.HintMockService) as HintMockService;


    before((done) => {
        mongooseHelper.createConnection();
        Promise.all([
            User.find({}).remove().exec(),
            BartStation.find({}).remove().exec()
        ])
            .then(() => {
                BartStation.addStations(mockApiBartStations)
                    .then(() => {
                        BartStation.getAllStations()
                            .then((dbStations) => {
                                globalStations = dbStations;
                                dbUserMock()
                                    .then((user) => {
                                        globalUser = user;
                                        done();
                                    })
                                    .catch((err) => {
                                        done(err);
                                    });
                            });
                    });
            })
            .catch((err) => {
                done(err);
            });
    });

    after((done) => {
        container.unbindAll();
        Promise.all([
            User.find({}).remove().exec(),
            BartStation.find({}).remove().exec()
        ])
            .then(() => {
                mongooseHelper.closeConnection();
                done();
            })
            .catch((err) => {
                done(err);
            });
    });

    it("should add user bart stations", (done) => {
        expect(globalUser.stations.destinationStation, "destinationStation wasn't null").to.eql(null);
        expect(globalUser.stations.destinationArrival, "destinationArrival wasn't null").to.eql(null);
        expect(globalUser.stations.homeStation, "homeStation wasn't null").to.eql(null);
        expect(globalUser.stations.homeStationArrival, "homeStationArrival wasn't null").to.eql(null);
        const addUserStations = {
            user: globalUser,
            body: {
                data: {
                    stations: {
                        homeStation: globalStations[0].abbr,
                        homeStationArrival: "08:00am",
                        destinationStation: globalStations[1].abbr,
                        destinationArrival: "05:00pm"
                    }
                }
            }
        };
        profileController.addUserStations(addUserStations)
            .then((successRes) => {
                expect(successRes.code, "incorrect code").to.eql(200);
                expect(successRes.data, "incorrect success message").to.eql(SUCCESS_CODES.BART_STATION.USER_STATION_ADDED);
                User.findById(globalUser._id)
                    .populate("stations.homeStation stations.destinationStation")
                    .exec()
                    .then((user: IUser) => {
                        console.log(user.stations.homeStation.location);
                        console.log(user.stations.destinationStation.location);
                        expect(user.stations.homeStation.abbr, "homeStation was incorrect").to.eql(globalStations[0].abbr);
                        expect(user.stations.homeStationArrival, "homeStationArrival was incorrect").to.eql(addUserStations.body.data.stations.homeStationArrival);
                        expect(user.stations.destinationStation.abbr, "destinationStation was incorrect").to.eql(globalStations[1].abbr);
                        expect(user.stations.destinationArrival, "destinationArrival was incorrect").to.eql(addUserStations.body.data.stations.destinationArrival);
                        done();
                    })
                    .catch((err) => {
                        done(err);
                    });
            })
            .catch((err) => {
                console.log(err);
                done(err);
            });
    });

});
