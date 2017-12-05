import {IQueueRequest} from "./IQueueRequest";

export interface IQueuePublisher {
    publish(message: IQueueRequest): Promise<any>;
}
