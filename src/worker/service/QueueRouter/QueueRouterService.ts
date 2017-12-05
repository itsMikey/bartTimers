import {provide} from "../../../common/ioc/ioc";
import TYPES from "../../../common/constant/types";
import {inject} from "inversify";
import {IQueueRequest} from "../../../common/constant/interfaces/queue/IQueueRequest";
import {IQueueHandlerService} from "../../../common/constant/interfaces/queue/IQueueHandlerService";
import {QueueRequestTypes} from "../../../common/constant/queue-request-types";
import {BartStationQueueHandlerService} from "../../../service/bart-station/BartStationQueueHandlerService";

export interface IQueueRouterService {
    route(message: IQueueRequest): Promise<boolean>;
}

@provide(TYPES.QueueRouterService)
export class QueueRouterService implements IQueueRouterService {

    constructor(@inject(TYPES.BartStationQueueHandlerService) private bartStationQueueHandlerService: BartStationQueueHandlerService) {
    }

    public route(message: IQueueRequest): Promise<boolean> {
        let handlerService: IQueueHandlerService;
        console.log("Routing Message: " + JSON.stringify(message));
        switch (message.type) {
            case QueueRequestTypes.POPULATE_BART_STATION_LIST:
                handlerService = this.bartStationQueueHandlerService;
                break;
            default:
                return Promise.reject("Unknown Message Type:" + message.type);
        }
        return handlerService.handleMessage(message);
    }
}
