
import { inject, injectable } from "inversify";
import TYPES from "../../common/constant/types";
import {IQueuePublisher} from "../../common/constant/interfaces/queue/IQueuePublisher";
import {HttpClient} from "../../common/util/httpclient";
import {AppConfigService} from "../app-config/AppConfigService";
import {IQueueRequest} from "../../common/constant/interfaces/queue/IQueueRequest";

@injectable()
export class QueuePublisherHttp implements IQueuePublisher {

    private httpClient: HttpClient;
    private workerEndPoint: string;

    public constructor(@inject(TYPES.AppConfigService) private appConfigService: AppConfigService) {
        // do something construct...
        this.workerEndPoint = appConfigService.getAppConfig().workerEndPoint;
        this.httpClient = new HttpClient({});
    }

    public publish(message: IQueueRequest): Promise<any> {
        const url: string = this.workerEndPoint;

        const args = {
            headers: {
                "Content-Type": "application/json"
            },
            data: message
        };
        return this.httpClient.doPost(url, args);
    }

}
