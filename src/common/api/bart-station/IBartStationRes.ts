import {IBartStation} from "../../../models/BartStation/BartStation";

export interface IBartStationRes {
    data: {
        stations: IBartStation[]
    };
}
