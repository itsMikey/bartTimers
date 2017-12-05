import {IApiRequest} from "../../../../api/IApiRequest";
import {IStations} from "./IStations";

// add home or destination station
export interface IApiAddUserStations extends IApiRequest {
    data: {
        stations: IStations
    };
}
