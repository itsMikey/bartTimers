import {IApiRequest} from "../IApiRequest";
import {IUser} from "../../../models/User/User";

export interface IUserRes extends IApiRequest {
    data: {
        user: IUser;
    };
}
