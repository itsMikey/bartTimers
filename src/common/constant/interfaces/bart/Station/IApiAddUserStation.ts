import {IBartStation} from "../../../../../models/BartStation/BartStation";
import {IApiRequest} from "../../../../api/IApiRequest";

// add home or destination station
export interface IApiAddUserStations extends IApiRequest {
    data: {
        stations: {
            homeStation: IBartStation,
            homeStationArrival: string,
            destinationStation: IBartStation,
            destinationArrival: string
        }
    };
}
