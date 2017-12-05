import {IBartStation} from "../../../models/BartStation/BartStation";
import {IClientFacingRoutes} from "../../../common/api/route/IClientFacingRoute";

interface IBartState {
    bartStations: IBartStation[];
    routes: IClientFacingRoutes[];
}

const defaultState: IBartState = {
    bartStations: null,
    routes: null
};

const bartReducer = (state = defaultState, action): IBartState => {
    switch (action.type) {
        case "GET_ALL_BART_STATIONS":
            return ({
                ...state,
                bartStations: action.payload.stations
            });
        case "GET_AVAILABLE_ROUTES":
            return ({
                ...state,
                routes: action.payload.routes
            });
        case "REMOVE_EXPIRED_ROUTE":
            return ({
                ...state,
                routes: action.payload.routes.shift()
            });
        default:
            return state;
    }
};

export default bartReducer;
