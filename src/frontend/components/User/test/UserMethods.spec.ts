import {expect} from "chai";
import axios from "axios";
import {MongooseService} from "../../../../service/dal/MongooseService";
import {Container} from "inversify";
import {AppConfigService} from "../../../../service/app-config/AppConfigService";
import TYPES from "../../../../common/constant/types";
import {IUser, User} from "../../../../models/User/User";
import {dbUserMock, userRegistrationMocker} from "../../../../../test-helpers/UserMocker";
import * as nock from "nock";
import {SUCCESS_CODES} from "../../../../common/constant/success-codes";
import {userMethods} from "../UserMethods";
import {mockApiBartStations} from "../../../../../test-helpers/BartObjectsMocker";
import {BartStation, IBartStation} from "../../../../models/BartStation/BartStation";
import {mongooseHelper} from "../../../../../test-helpers/MongooseHelper";
import {IRegisterApiReq} from "../../../../common/api/register/IRegisterApiReq";

describe("Frontend User Methods", () => {
    const TEST_URL: string = "http://localhost:4000/";
    const container = new Container();
    const registerReq: IRegisterApiReq = userRegistrationMocker();
    const loginAndRegisterResponse = {
        data: {
            loggedIn: true,
            firstName: registerReq.data.firstName,
            email: registerReq.data.email,
            devices: [],
            stations: {
                homeStation: null,
                homeStationArrival: null,
                destinationArrival: null,
                destinationStation: null
            }
        } as IUser
    };
    container.bind<AppConfigService>(TYPES.AppConfigService).to(AppConfigService);
    container.bind<MongooseService>(TYPES.MongooseService).to(MongooseService);
    let appConfigService: AppConfigService = container.get(TYPES.AppConfigService) as AppConfigService;
    let globalStations: IBartStation[];
    let globalUser: IUser;

    before((done) => {
        mongooseHelper.createConnection();
        if (appConfigService.getAppConfig().app.isTest) {
            axios.defaults.baseURL = TEST_URL;
        }
        Promise.all([
            BartStation.remove({}).exec(),
            User.remove({}).exec()
        ])
            .then(() => {
                BartStation.addStations(mockApiBartStations).then(() => {
                    Promise.all([
                        BartStation.getAllStations(),
                        dbUserMock()
                    ])
                        .then((promiseRes) => {
                            globalStations = promiseRes[0];
                            globalUser = promiseRes[1];
                            done();
                        })
                        .catch((err) => {
                            done(err);
                        });
                });
            })
            .catch((err) => {
                done();
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
                done(err);
            });
    });

    it("should add user stations", (done) => {
        const addStationsReq = {
            data: {
                homeStation: globalStations[0].abbr,
                homeStationArrival: "05:00pm",
                destinationArrival: "08:00am",
                destinationStation: globalStations[1].abbr
            }
        };
        const addUserStationsNock = nock(TEST_URL)
            .post(`/@BACKEND_API@/api/v1/profile/add-user-stations`)
            .reply(200, {
                code: 200,
                data: SUCCESS_CODES.BART_STATION.USER_STATION_ADDED
            });
        userMethods.addUserStations(addStationsReq)
            .then((success) => {
                expect(success.data, "adding stations function was not successful").to.eql(SUCCESS_CODES.BART_STATION.USER_STATION_ADDED);
                done();
            })
            .catch((err) => {
                console.log(err);
                return Promise.reject(err);
            });
    });

    it("should accept a register request and receive loggged in user", (done) => {
        const registrationNock = nock(TEST_URL)
            .post("/@BACKEND_API@/public-api/register")
            .reply(200, loginAndRegisterResponse);

        userMethods.registerUser(registerReq)
            .then((registerRes) => {
                const user: IUser = registerRes.data;
                expect(user.loggedIn, "didn't get loggedIn correctly").to.eql(loginAndRegisterResponse.data.loggedIn);
                expect(user.firstName, "didn't get firstName correctly").to.eql(loginAndRegisterResponse.data.firstName);
                expect(user.email, "didn't get email correctly").to.eql(loginAndRegisterResponse.data.email);
                expect(user.devices.length, "didn't get devices correctly").to.eql(loginAndRegisterResponse.data.devices.length);
                expect(user.stations.homeStation, "didn't get homeStation correctly").to.eql(loginAndRegisterResponse.data.stations.homeStation);
                expect(user.stations.homeStationArrival, "didn't get homeStationArrival correctly").to.eql(loginAndRegisterResponse.data.stations.homeStationArrival);
                expect(user.stations.destinationStation, "didn't get destinationStation correctly").to.eql(loginAndRegisterResponse.data.stations.destinationStation);
                expect(user.stations.destinationArrival, "didn't get destinationArrival correctly").to.eql(loginAndRegisterResponse.data.stations.destinationArrival);
                done();
            })
            .catch((err) => {
                done(err);
            });
    });


    it("should accept response for logged in user", (done) => {
        const loginNock = nock(TEST_URL)
            .post("/@BACKEND_API@/public-api/login")
            .reply(200, loginAndRegisterResponse);

        userMethods.loginUser(loginAndRegisterResponse)
            .then((loginRes) => {
                const user: IUser = loginRes.data;
                expect(user.loggedIn, "didn't get loggedIn correctly").to.eql(loginAndRegisterResponse.data.loggedIn);
                expect(user.firstName, "didn't get firstName correctly").to.eql(loginAndRegisterResponse.data.firstName);
                expect(user.email, "didn't get email correctly").to.eql(loginAndRegisterResponse.data.email);
                expect(user.devices.length, "didn't get devices correctly").to.eql(loginAndRegisterResponse.data.devices.length);
                expect(user.stations.homeStation, "didn't get homeStation correctly").to.eql(loginAndRegisterResponse.data.stations.homeStation);
                expect(user.stations.homeStationArrival, "didn't get homeStationArrival correctly").to.eql(loginAndRegisterResponse.data.stations.homeStationArrival);
                expect(user.stations.destinationStation, "didn't get destinationStation correctly").to.eql(loginAndRegisterResponse.data.stations.destinationStation);
                expect(user.stations.destinationArrival, "didn't get destinationArrival correctly").to.eql(loginAndRegisterResponse.data.stations.destinationArrival);
                done();
            })
            .catch((err) => {
                done(err);
            });

    });

    it("should accept response for checking a user's login", (done) => {
        const checkUserLogin = nock(TEST_URL)
            .get("/@BACKEND_API@/public-api/me")
            .reply(200, loginAndRegisterResponse);

        userMethods.checkLogin()
            .then((loginRes) => {
                const user: IUser = loginRes.data;
                expect(user.loggedIn, "didn't get loggedIn correctly").to.eql(loginAndRegisterResponse.data.loggedIn);
                expect(user.firstName, "didn't get firstName correctly").to.eql(loginAndRegisterResponse.data.firstName);
                expect(user.email, "didn't get email correctly").to.eql(loginAndRegisterResponse.data.email);
                expect(user.devices.length, "didn't get devices correctly").to.eql(loginAndRegisterResponse.data.devices.length);
                expect(user.stations.homeStation, "didn't get homeStation correctly").to.eql(loginAndRegisterResponse.data.stations.homeStation);
                expect(user.stations.homeStationArrival, "didn't get homeStationArrival correctly").to.eql(loginAndRegisterResponse.data.stations.homeStationArrival);
                expect(user.stations.destinationStation, "didn't get destinationStation correctly").to.eql(loginAndRegisterResponse.data.stations.destinationStation);
                expect(user.stations.destinationArrival, "didn't get destinationArrival correctly").to.eql(loginAndRegisterResponse.data.stations.destinationArrival);
                done();
            })
            .catch((err) => {
                done(err);
            });
    });

    it("should correctly check settings object", (done) => {
        let settings = {
            homeStation: undefined,
            homeStationArrival: undefined,
            destinationArrival: undefined,
            destinationStation: undefined
        };
        expect(userMethods.userHasSettings(settings), "didn't correctly check user settings object 1").to.eql(false);
        settings.homeStation = globalStations[0];
        expect(userMethods.userHasSettings(settings), "didn't correctly check user settings object 2").to.eql(false);
        settings.homeStationArrival = "05:00pm";
        settings.destinationStation = globalStations[1];
        settings.destinationArrival = "08:00am";
        expect(userMethods.userHasSettings(settings), "didn't correctly check user settings object 3").to.eql(true);
        done();
    });

});

