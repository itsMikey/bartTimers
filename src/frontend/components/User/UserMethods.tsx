import {httpRequest} from "../../utils/AxiosClient";


export const userMethods = {
    addUserStations: (data) => httpRequest.post("/api/v1/profile/add-user-stations", data),
    checkLogin: () => httpRequest.get("/public-api/me"),
    loginUser: (data) => httpRequest.post("/public-api/login", data),
    registerUser: (data) => httpRequest.post("/public-api/register", data),
    userHasSettings: (settings) => {
        if (!settings.homeStation || !settings.destinationStation || !settings.destinationArrival || !settings.homeStationArrival) {
            return false;
        } else {
            return true;
        }
    }
};




