// worker handles queue requests to take load off our main app
import * as express from "express";
global.Promise = require("bluebird");
import bodyParser = require("body-parser");
import errorHandler = require("errorhandler");
import * as methodOverride from "method-override";
import {interfaces, InversifyExpressServer, TYPE} from "inversify-express-utils";
import {container} from "../common/ioc/ioc";
import * as morgan from "morgan";
import {AppConfigService} from "../service/app-config/AppConfigService";
import {QueueControllerFactory} from "./controller/queue/queue";
import TAGS from "./tags";
import TYPES from "../common/constant/types";
import {IQueueRouterService} from "./service/QueueRouter/QueueRouterService";
import "./ioc/loader";

class Server {
    public static instance: Server;

    public static bootstrap(): Server {
        if (!Server.instance) {
            Server.instance = new Server();
        }
        return Server.instance;
    }

    public app: express.Application;
    private inversifyServer: InversifyExpressServer;
    private appConfigService: AppConfigService = new AppConfigService();

    constructor() {
        this.config();
        console.log("Application Started");
    }

    private config() {
        if (!this.appConfigService.getAppConfig().app.isProd) {
            container.bind<express.RequestHandler>("Morgan").toConstantValue(morgan("dev"));
        } else {
            container.bind<express.RequestHandler>("Morgan").toConstantValue(morgan("combined"));
        }


        container.bind<interfaces.Controller>(TYPE.Controller).to(QueueControllerFactory(container,
            container.get(TYPES.QueueRouterService) as IQueueRouterService))
            .whenTargetNamed(TAGS.QueueController);


        this.inversifyServer = new InversifyExpressServer(container);
        this.inversifyServer.setConfig((app) => {
            // mount json form parser
            app.use(bodyParser.json());

            // mount query string parser
            app.use(bodyParser.urlencoded({ extended: true }));

            // Method Overrides
            app.use(methodOverride());

            // catch 404 and forward to error handler
            app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
                err.status = 404;
                next(err);
            });

            // error handling
            app.use(errorHandler());

        });
        this.app = this.inversifyServer.build();
    }

}
const app = Server.bootstrap().app;
module.exports = app;

