import {controller, httpDelete, httpGet, httpPost, httpPut} from "inversify-express-utils";

import { Request } from "express";
import {Container, injectable} from "inversify";
import {IQueueRouterService} from "../../service/QueueRouter/QueueRouterService";

export interface IQueueController {
    queue(req: Request): Promise<any>;
}

/* Queue router  will use the correct queueRequestHandler Service
*  Populating bart stations is BartStationQueueHandlerService for example
* */
export function QueueControllerFactory(container: Container, queueRouterService: IQueueRouterService) {

    @injectable()
    @controller("/queue")
    class QueueController {

        @httpPost("/")
        public queue(req: Request): Promise<any> {

            try {
                console.log("Queue Request: " + JSON.stringify(req.body));
                if (req.body) {
                    return queueRouterService.route(req.body)
                        .then((data) => {
                            return Promise.resolve({ status: "OK" });
                        })
                        .catch((err) => {
                            console.log(err.toString());
                            return Promise.reject({ status: "FAIL" });
                        });

                } else {
                    console.log("No Message to handle");
                    return Promise.reject({ status: "FAIL" });
                }

            } catch (err) {
                console.log(err.toString());
                return Promise.reject({ status: "FAIL" });
            }
        }
    }
    return QueueController;

}
