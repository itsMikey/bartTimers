import {IQueueRequest} from "./IQueueRequest";

export interface IQueueHandlerService {
    handleMessage(message: IQueueRequest): Promise<any>;

}
