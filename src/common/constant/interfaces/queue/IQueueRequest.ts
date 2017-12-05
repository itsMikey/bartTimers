

import {QueueRequestTypes} from "../../queue-request-types";

export interface IQueueRequest {
    type: QueueRequestTypes;
    email?: string;
    data?: any;
}
