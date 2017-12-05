import {provide} from "../../common/ioc/ioc";
import TYPES from "../../common/constant/types";
import {IQueueHandlerService} from "../../common/constant/interfaces/queue/IQueueHandlerService";
import {BaseQueueHandlerService} from "../queue/BaseQueueHandlerService";
import {inject} from "inversify";
import {BartStationService} from "./BartStationService";
import {IQueueRequest} from "../../common/constant/interfaces/queue/IQueueRequest";
import {QueueRequestTypes} from "../../common/constant/queue-request-types";

@provide(TYPES.BartStationQueueHandlerService)
export class BartStationQueueHandlerService extends BaseQueueHandlerService implements IQueueHandlerService {

    public constructor(@inject(TYPES.BartStationService) private bartStationService: BartStationService) {
        super();
    }

    public handleMessage(message: IQueueRequest): Promise<boolean> {
        let handler: (queueMessage: IQueueRequest) => Promise<boolean>;
        console.log("Handling Message: " + JSON.stringify(message));
        switch (message.type) {
            // get list of bart stations from api
            case QueueRequestTypes.POPULATE_BART_STATION_LIST:
                handler = (queueMessage) => this.bartStationService.populateStations();
                break;
            default:
                return Promise.reject("Unknown Message Type:" + message.type);
        }
        return super.executeHandler(handler, message);
    }
}
