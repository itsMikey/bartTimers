// set home station
// set destination station

import TYPES from "../../common/constant/types";
import {provide} from "../../common/ioc/ioc";
import {IUser, User} from "../../models/User/User";
import {IApiAddUserStations} from "../../common/constant/interfaces/bart/Station/IApiAddUserStation";
import {IRegisterApiReq} from "../../common/api/register/IRegisterApiReq";
import {inject} from "inversify";
import {MongooseService} from "../dal/MongooseService";
import {BartStation} from "../../models/BartStation/BartStation";

export interface IUserService {
    addUserStations(addStationReq: IApiAddUserStations): Promise<string>;

    registerUser(registerReq: IRegisterApiReq): Promise<IUser>;

    getUserForClient(userId: string): Promise<object>;
}

@provide(TYPES.UserService)
export class UserService implements IUserService {

    public constructor(@inject(TYPES.MongooseService) private mongooseService: MongooseService) {
    }

    public addUserStations(addStationReq: IApiAddUserStations): Promise<string> {
        return User.addStations(addStationReq);
    }

    public registerUser(registerReq: IRegisterApiReq): Promise<IUser> {
        return User.register(registerReq);
    }

    // client facing user object
    public getUserForClient(userId: string): Promise<IUser> {
        return User.getUserForClient(userId)
            .then((user) => {
                return Promise.resolve(user.toObject() as IUser);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    }
}
