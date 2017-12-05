
import {injectable} from "inversify";
import {IQueueRequest} from "../../common/constant/interfaces/queue/IQueueRequest";
@injectable()
export class BaseQueueHandlerService {
    // handle the queue requests
    public executeHandler(handler: (message: IQueueRequest, data?: any) => Promise<any>, message: IQueueRequest): Promise<any> {
        return handler(message)
            .then((result) => {
                if (!result) {
                    console.log("Failed to handle message: " + JSON.stringify(message));
                    return Promise.reject({status: "FAIL"});
                }
                return Promise.resolve(true);

            })
            .catch((err) => {
                console.log(err);
                console.log("Failed to handle message: " + JSON.stringify(message));
                return Promise.reject({status: "FAIL"});
            }) as any;
    }
}
