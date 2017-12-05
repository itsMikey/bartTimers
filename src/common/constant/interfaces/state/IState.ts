import {IClientUser} from "../../../../frontend/state/reducers/UserReducer";
import {IStateBart} from "./IStateBart";

export interface IState {
    bart: IStateBart;
    user: IClientUser;
}

