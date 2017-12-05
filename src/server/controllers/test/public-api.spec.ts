import {expect} from "chai";
import {mongooseHelper} from "../../../../test-helpers/MongooseHelper";
import {User} from "../../../models/User/User";
import {BartStation, IBartStation} from "../../../models/BartStation/BartStation";
import {mockApiBartStations} from "../../../../test-helpers/BartObjectsMocker";
import {IRegisterApiReq} from "../../../common/api/register/IRegisterApiReq";
import {userRegistrationMocker} from "../../../../test-helpers/UserMocker";
import {Container} from "inversify";
import {UserService} from "../../../service/user/UserService";
import TYPES from "../../../common/constant/types";
import {BartStationService} from "../../../service/bart-station/BartStationService";
import {ApiHandlerService} from "../../../service/api-handler/ApiHandlerService";
import {MongooseService} from "../../../service/dal/MongooseService";
import {IPublicApiController, PublicApiControllerFactory} from "../public-api";
import {interfaces, TYPE} from "inversify-express-utils";
import TAGS from "../tags";
import {AppConfigService} from "../../../service/app-config/AppConfigService";

describe("public api controller", () => {
    let globalStations: IBartStation[];
    let container = new Container();

    container.bind<UserService>(TYPES.UserService).to(UserService);
    container.bind<AppConfigService>(TYPES.AppConfigService).to(AppConfigService);
    container.bind<BartStationService>(TYPES.BartStationService).to(BartStationService);
    container.bind<ApiHandlerService>(TYPES.ApiHandlerService).to(ApiHandlerService);
    container.bind<MongooseService>(TYPES.MongooseService).to(MongooseService);
    let publicApiControllerFactory = PublicApiControllerFactory(container);
    container.bind<interfaces.Controller>(TYPE.Controller).to(publicApiControllerFactory)
        .whenTargetNamed(TAGS.PublicApiController);
    let publicApiController: IPublicApiController = container.getNamed(TYPE.Controller, TAGS.PublicApiController) as IPublicApiController;

    before((done) => {
        mongooseHelper.createConnection();
        Promise.all([
            BartStation.remove({}).exec()
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

    it("should get all stations", (done) => {
        publicApiController.getAllPublicStations()
            .then((stationRes) => {
                expect(stationRes.data.stations.length, "didn't return all stations").to.eql(mockApiBartStations.length);
                done();
            })
            .catch((err) => {
                done(err);
            });
    });

});

