
import {IApiRequest} from "../IApiRequest";

export interface IRegisterApiReq extends IApiRequest {
    data: {
        firstName?: string;
        lastName?: string;
        email: string;
        password: string;
        device?: { token: string; name: string, uniqueId: string };
    };
}
