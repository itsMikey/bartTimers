import * as express from "express";
import * as helmet from "helmet";
import bodyParser = require("body-parser");
import errorHandler = require("errorhandler");

class Server {
    public static instance: Server;

    public static bootstrap(): Server {
        if (!Server.instance) {
            Server.instance = new Server();
        }
        return Server.instance;
    }
    public app: express.Application;

    constructor() {
        this.config();
        console.log("Application Started");
    }

    private config() {
        this.app.set("trust proxy", true);
        this.app.use(bodyParser.json());

        this.app.use(bodyParser.urlencoded({ extended: true }));

        this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
            err.status = 404;
            next(err);
        });

        this.app.use(errorHandler());


        // Use Helmet
        this.app.use(helmet());
    }
}
const app = Server.bootstrap().app;
module.exports = app;

