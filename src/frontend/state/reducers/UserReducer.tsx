import {IStations} from "../../../common/constant/interfaces/bart/Station/IStations";

export interface IClientUser {
        loggedIn: boolean;
        devices?: Array<{ token: string; name: string, uniqueId: string }>;
        stations: IStations;
}

const defaultState: IClientUser = {
        loggedIn: false,
        devices: [],
        stations: {
            homeStation: null,
            homeStationArrival: null,
            destinationArrival: null,
            destinationStation: null
        }
};

const userReducer = (state = defaultState, action) => {
    switch (action.type) {
        case "IS_USER_LOGGED_IN":
            return {
                ...state,
                ...action.payload,
                stations: {
                    ...state.stations,
                    ...action.payload.stations
                }
            };
        case "GET_USER_SETTINGS":
            return {
                ...state,
                ...action.payload
            };
        case "POPULATE_USER":
            return {
                ...state,
                ...action.payload,
                stations: {
                    ...state.stations,
                    ...action.payload.stations
                }
            };
        case "POPULATE_USER_BART_STATIONS":

            return {
                    ...state,
                    stations: {
                        ...state.stations,
                        ...action.payload
                    }
            };
        default:
            return state;
    }
};

export default userReducer;
