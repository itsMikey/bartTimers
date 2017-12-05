import {PublicApiControllerFactory} from "./controllers/public-api";

global.Promise = require("bluebird");
import * as express from "express";
import * as helmet from "helmet";
import bodyParser = require("body-parser");
import errorHandler = require("errorhandler");
import morgan = require("morgan");
import * as methodOverride from "method-override";
import {interfaces, InversifyExpressServer, TYPE} from "inversify-express-utils";
import {container} from "../common/ioc/ioc";
import * as path from "path";
import TAGS from "./controllers/tags";
import {HomeControllerFactory} from "./controllers/home";
import {MongooseService} from "../service/dal/MongooseService";
import {AppConfigService} from "../service/app-config/AppConfigService";
import {AuthService} from "./controllers/authentication/auth";
import * as passport from "passport";
import {ProfileControllerFactory} from "./controllers/profile";
const session = require("express-session");

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
    private mongooseService: MongooseService = new MongooseService(this.appConfigService);
    private authService: AuthService = new AuthService(this.mongooseService);

    constructor() {
        this.config();
        console.log("Application Started");
    }

    private config() {

        let homeControllerFactory = HomeControllerFactory(container);
        container.bind<interfaces.Controller>(TYPE.Controller).to(homeControllerFactory)
            .whenTargetNamed(TAGS.HomeController);

        let publicApiControllerFactory = PublicApiControllerFactory(container);
        container.bind<interfaces.Controller>(TYPE.Controller).to(publicApiControllerFactory)
            .whenTargetNamed(TAGS.PublicApiController);

        let profileControllerFactory = ProfileControllerFactory(container);
        container.bind<interfaces.Controller>(TYPE.Controller).to(profileControllerFactory)
            .whenTargetNamed(TAGS.ProfileController);


        this.inversifyServer = new InversifyExpressServer(container);
        this.inversifyServer.setConfig((app) => {
            // req.ip will now be set to req.headers["x-forwarded-for"] if supplied by the proxy.
            app.set("trust proxy", true);

            // add static paths
            app.use(express.static(path.join(__dirname, "./static")));

            // configure pug
            app.set("views", path.join("./views"));
            app.set("view engine", "pug");

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


            // Use Helmet
            app.use(helmet());

            // express session
            app.use(session(
                {
                    resave: true,
                    saveUninitialized: true,
                    secret: "Hv=!K8c#GzCfhSjXdENRLW_*%PEp*6mU"
                }));
            app.use(passport.initialize());
            app.use(passport.session());
            this.authService.initialize();

        });
        this.app = this.inversifyServer.build();
    }

}
const app = Server.bootstrap().app;
module.exports = app;




