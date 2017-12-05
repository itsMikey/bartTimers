import {IApiRequest} from "../../../../api/IApiRequest";

export interface IPlanRoute extends IApiRequest {
    data: {
        orig: string;
        dest: string;
        time: string;
    };
}
