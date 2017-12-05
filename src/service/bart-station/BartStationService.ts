import {provide} from "../../common/ioc/ioc";
import TYPES from "../../common/constant/types";
import {HttpClient} from "../../common/util/httpclient";
import {inject} from "inversify";
import {AppConfigService} from "../app-config/AppConfigService";
import {BartStation, IBartStation} from "../../models/BartStation/BartStation";
import {IApiBartStation} from "../../common/constant/interfaces/bart/Station/IApiBartStation";
import {MongooseService} from "../dal/MongooseService";
import {IPlanRoute} from "../../common/constant/interfaces/bart/Routes/IPlanRoute";
import {IClientFacingRoutes} from "../../common/api/route/IClientFacingRoute";

export interface IBartStationService {
    addAllStationsToDb(stations: IApiBartStation[]): Promise<string>;

    populateStations(): Promise<boolean>;

    getAllStations(): Promise<IBartStation[]>;
}

@provide(TYPES.BartStationService)
export class BartStationService implements IBartStationService {
    private httpClient: HttpClient;
    private stationUrl: string;

    public constructor(@inject(TYPES.AppConfigService) private appConfigService: AppConfigService,
                       @inject(TYPES.MongooseService) private mongooseService: MongooseService) {
        this.httpClient = new HttpClient({});
        this.stationUrl = this.appConfigService.getAppConfig().bart.baseUrl;
    }

    // populate DB (not user)
    public addAllStationsToDb(stations: IApiBartStation[]): Promise<string> {
        return BartStation.addStations(stations);
    }

    // get routes for user's defined settings
    public routePlanner(route: IPlanRoute) {
        const getRouteUrl: string = `${this.stationUrl}sched.aspx?cmd=arrive&orig=${route.data.orig}&dest=${route.data.dest}&time=${route.data.time}&b=0&key=${this.appConfigService.getAppConfig().bart.apiKey}&json=y`;
        let clientFacingRoutes = {
            routes: []
        };
        return this.httpClient.doGet(getRouteUrl, {})
            .then((routeResponse) => {
                if (routeResponse.root.message.error) {
                    return Promise.reject(routeResponse.root.message.error);
                }
                const trip = routeResponse.root.schedule.request.trip;
                let findBartStationPromiseArray = [];
                // find stations in our db for each route
                for (let i = 0, j = trip.length; i < j; i++) {
                    findBartStationPromiseArray.push(
                    new Promise((resolve, reject) => {
                        Promise.all([
                            BartStation.findOne({"abbr": trip[i][`@origin`]}),
                            BartStation.findOne({"abbr": trip[i][`@destination`]})
                        ])
                            .then((foundStations) => {
                                // return IPlanRoute for each route
                                return resolve(clientFacingRoutes.routes.push({
                                    origin: foundStations[0],
                                    originDepartureTime: trip[i]["@origTimeMin"],
                                    destination: foundStations[1],
                                    destinationArrivalTime: trip[i]["@destTimeMin"],
                                    tripLength: trip[i]["@tripTime"],
                                    fare: trip[i]["@fare"]
                                } as IClientFacingRoutes));
                            })
                            .catch((err) => {
                                console.log(err);
                                return reject(err);
                            });
                    }));
                }
                return Promise.all(findBartStationPromiseArray)
                    .then(() => {
                        return Promise.resolve(clientFacingRoutes);
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
    }

    // call api to get list of bart stations
    public populateStations(): Promise<boolean> {
        // get stations from BART API
        const getStationsUrl: string = `${this.stationUrl}stn.aspx?cmd=stns&key=${this.appConfigService.getAppConfig().bart.apiKey}&json=y`;
        return this.httpClient.doGet(getStationsUrl, {})
            .then((bartApiRes) => {
                // lookup table so we can parse longitude/latitutde
                const lookUpPropTable = {gtfs_latitude: 1, gtfs_longitude: 1};
                const stations: IApiBartStation[] = JSON.parse(JSON.stringify(bartApiRes), (key, val) => {
                    return lookUpPropTable.hasOwnProperty(key) ? parseFloat(val) : val;
                })[`root`][`stations`][`station`];


                return this.addAllStationsToDb(stations)
                    .then((res) => {
                        return Promise.resolve(true);
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
    }

    // get stations from mongo
    public getAllStations(): Promise<IBartStation[]> {
        return BartStation.getAllStations();
    }
}
