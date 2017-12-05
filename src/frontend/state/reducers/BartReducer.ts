import {IStateBart} from "../../../common/constant/interfaces/state/IStateBart";


const defaultState: IStateBart = {
    bartStations: null,
    routes: null
};

const bartReducer = (state = defaultState, action): IStateBart => {
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
