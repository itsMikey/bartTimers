import {IBartStation} from "../../../../../models/BartStation/BartStation";

export interface IStations {
        homeStation: IBartStation;
        homeStationArrival: string;
        destinationArrival: string;
        destinationStation: IBartStation;
}
