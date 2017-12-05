import {controller, httpPost} from "inversify-express-utils";
import {Container, inject, injectable} from "inversify";
import {UserService} from "../../service/user/UserService";
import TYPES from "../../common/constant/types";
import {ApiHandlerService} from "../../service/api-handler/ApiHandlerService";
import {IApiAddUserStations} from "../../common/constant/interfaces/bart/Station/IApiAddUserStation";
import {IApiRequest} from "../../common/api/IApiRequest";
import {BartStation} from "../../models/BartStation/BartStation";
import {MongooseService} from "../../service/dal/MongooseService";

export interface IProfileController {
    addUserStations(req): Promise<IApiRequest>;
}
export function ProfileControllerFactory(container: Container) {


    @injectable()
    @controller("/api/v1/profile")
    class ProfileController implements IProfileController {
        constructor(@inject(TYPES.UserService) private userService: UserService,
                    @inject(TYPES.ApiHandlerService) private apiHandlerService: ApiHandlerService,
                    @inject(TYPES.MongooseService) private mongooseService: MongooseService) {
        }

        @httpPost("/add-user-stations")
        public addUserStations(req): Promise<IApiRequest> {
            const addStationsReq: IApiAddUserStations = this.apiHandlerService.extractApiRequest(req);
            // get actual stations from abbr
            return Promise.all([
                BartStation.findOne({"abbr": addStationsReq.data.stations.homeStation}),
                BartStation.findOne({"abbr": addStationsReq.data.stations.destinationStation})
            ])
                .then((stationsInDb) => {
                    addStationsReq.data.stations.homeStation = stationsInDb[0];
                    addStationsReq.data.stations.destinationStation = stationsInDb[1];
                    return this.userService.addUserStations(addStationsReq)
                        .then((res) => {
                            return Promise.resolve(this.apiHandlerService.returnData(res));
                        })
                        .catch((err) => {
                            console.log(err);
                            return Promise.reject(this.apiHandlerService.returnErr(err));
                        });
                });
        }

    }
    return ProfileController;
}
