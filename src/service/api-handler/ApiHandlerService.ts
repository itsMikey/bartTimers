import {provide} from "../../common/ioc/ioc";
import TYPES from "../../common/constant/types";
import {IApiRequest} from "../../common/api/IApiRequest";

@provide(TYPES.ApiHandlerService)
export class ApiHandlerService {

    // extract user
    public extractApiRequest(req: any): IApiRequest {
        return {
            userSession: {
                _id: (req.user && req.user._id) ? req.user._id : null,
                id: (req.user && req.user._id) ? req.user._id.toString() : null,
                email: (req.user && req.user.email) ? req.user.email : null,
                firstName: (req.user && req.user.firstName) ? req.user.firstName : null,
                lastName: (req.user && req.user.lastName) ? req.user.lastName : null,
                accessToken: (req.user && req.user.accessToken) ? req.user.accessToken : null,
                scope: (req.user && req.user.scope) ? req.user.scope : null
            },
            data: (req.body && req.body.data) ? req.body.data : null
        };
    }

    // passport authenticated request
    public extractAuthenticatedRequest(req: any) {
        const user = JSON.parse(JSON.stringify(req.session)).passport.user;
        console.log(user);
        return {
            userSession: {
                _id: (user && user._id) ? user._id : null,
                id: (user && user._id) ? user._id.toString() : null,
                email: (user && user.email) ? user.email : null,
                userName: (user && user.userName) ? user.userName : null,
                firstName: (user && user.firstName) ? user.firstName : null,
                lastName: (user && user.lastName) ? user.lastName : null,
                role: (user && user.role) ? user.role : null
            },
            data: (req.body && req.body.data) ? req.body.data : null
        };
    }

    // extract parameters from api request
    public extractParamsApiRequest(req: any) {
        return {
            userSession: {
                _id: (req.user && req.user._id) ? req.user._id : null,
                id: (req.user && req.user._id) ? req.user._id.toString() : null,
                email: (req.user && req.user.email) ? req.user.email : null,
                firstName: (req.user && req.user.firstName) ? req.user.firstName : null,
                lastName: (req.user && req.user.lastName) ? req.user.lastName : null,
                accessToken: (req.user && req.user.accessToken) ? req.user.accessToken : null,
                scope: (req.user && req.user.scope) ? req.user.scope : null
            },
            data: (req.params) ? req.params : null
        };
    }

    // all data is returned in the data property
    public returnData(data: any): IApiRequest {
        return {
            code: 200,
            data: data
        };
    }

    public returnErr(message: string, errCode = 400) {
        return {
            code: errCode || 400,
            message: message
        };
    }
}
