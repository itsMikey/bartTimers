import {IApiRequest} from "../IApiRequest";
import {IBartStation} from "../../../models/BartStation/BartStation";

export interface IClientFacingRoutes {
    origin: IBartStation;
    originDepartureTime: string;
    destination: IBartStation;
    destinationArrivalTime: string;
    tripLength: string;
    fare: string;
}
export interface IClientFacingRoutesResponse extends IApiRequest {
    data: {
        routes: IClientFacingRoutes[]
    };
}
