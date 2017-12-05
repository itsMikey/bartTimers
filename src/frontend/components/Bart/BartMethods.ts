import {httpRequest} from "../../utils/AxiosClient";
import {IClientFacingRoutesResponse} from "../../../common/api/route/IClientFacingRoute";
import {IBartStationRes} from "../../../common/api/bart-station/IBartStationRes";

export const bartMethods = {
    getBartStations: (): Promise<IBartStationRes> => httpRequest.get("/public-api/get-stations"),
    routePlanner: (dest: string, orig: string, time: string): Promise<IClientFacingRoutesResponse> => httpRequest.get(`/public-api/plan-route/${dest}/${orig}/${time}`)
};
