import {expect} from "chai";
import {AppConfigService} from "../../../../service/app-config/AppConfigService";
import {Container} from "inversify";
import TYPES from "../../../../common/constant/types";
import {MongooseService} from "../../../../service/dal/MongooseService";
import {mongooseHelper} from "../../../../../test-helpers/MongooseHelper";
import axios from "axios";
import * as nock from "nock";
import {bartMethods} from "../BartMethods";
import {mockApiBartStations} from "../../../../../test-helpers/BartObjectsMocker";
import {BartStation, IBartStation} from "../../../../models/BartStation/BartStation";

describe("Bart Methods", () => {
    const TEST_URL: string = "http://localhost:4000/";
    const container = new Container();
    container.bind<AppConfigService>(TYPES.AppConfigService).to(AppConfigService);
    container.bind<MongooseService>(TYPES.MongooseService).to(MongooseService);
    let appConfigService: AppConfigService = container.get(TYPES.AppConfigService) as AppConfigService;
    let globalStations: IBartStation[];

    before((done) => {
        mongooseHelper.createConnection();
        if (appConfigService.getAppConfig().app.isTest) {
            axios.defaults.baseURL = TEST_URL;
        }
        BartStation.remove({}).exec()
            .then(() => {
                BartStation.addStations(mockApiBartStations)
                    .then(() => {
                        BartStation.getAllStations()
                            .then((stations: IBartStation[]) => {
                                globalStations = stations;
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

    after((done) => {
        BartStation.remove({}).exec()
            .then(() => {
                container.unbindAll();
                mongooseHelper.closeConnection();
                done();
            })
            .catch((err) => {
                console.log(err);
                return Promise.reject(err);
            });
    });

    it("should properly get all bart stations", (done) => {
        const stationReq = nock(TEST_URL)
            .get("/@BACKEND_API@/public-api/get-stations")
            .reply(200, {
                data: {
                    stations: globalStations
                }
            });

        bartMethods.getBartStations()
            .then((stationRes) => {
                expect(stationRes.data.stations.length, "incorrect length").to.eql(mockApiBartStations.length);
                done();
            })
            .catch((err) => {
                done(err);
            });
    });

    it("should properly retrieve routes", (done) => {
        const dest: string = globalStations[0].abbr;
        const orig: string = globalStations[1].abbr;
        const time: string = "08:00am";
        const routesResponse = {
            data: {
                routes: [
                    {
                        origin: globalStations[0],
                        originDepartureTime: "07:30am",
                        destination: globalStations[1],
                        destinationArrivalTime: "08:10am",
                        tripLength: "40minutes",
                        fare: "$5.00"
                    }
                ]
            }
        };
        const routeReq = nock(TEST_URL)
            .get(`/@BACKEND_API@/public-api/plan-route/${dest}/${orig}/${time}`)
            .reply(200, routesResponse);
        bartMethods.routePlanner(dest, orig, time)
            .then((routesRes) => {
                expect(routesRes.data.routes[0].origin._id, "incorrect origin").to.eql(routesResponse.data.routes[0].origin._id.toString());
                expect(routesRes.data.routes[0].originDepartureTime, "incorrect originDepartureTime").to.eql(routesResponse.data.routes[0].originDepartureTime);
                expect(routesRes.data.routes[0].destination._id, "incorrect destination").to.eql(routesResponse.data.routes[0].destination._id.toString());
                expect(routesRes.data.routes[0].destinationArrivalTime, "incorrect destinationArrivalTime").to.eql(routesResponse.data.routes[0].destinationArrivalTime);
                expect(routesRes.data.routes[0].tripLength, "incorrect tripLength").to.eql(routesResponse.data.routes[0].tripLength);
                expect(routesRes.data.routes[0].fare, "incorrect fare").to.eql(routesResponse.data.routes[0].fare);
                done();
            })
            .catch((err) => {
                done(err);
            });
    });

});

