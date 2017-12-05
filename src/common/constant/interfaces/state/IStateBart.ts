import {IBartStation} from "../../../../models/BartStation/BartStation";
import {IClientFacingRoutes} from "../../../api/route/IClientFacingRoute";

export interface IStateBart  {
    bartStations: IBartStation[];
    routes: IClientFacingRoutes[];
}

