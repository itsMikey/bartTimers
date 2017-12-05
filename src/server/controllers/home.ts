import {all, controller, httpGet} from "inversify-express-utils";

import { Request, Response } from "express";
import TYPES from "../../common/constant/types";
import { Container, inject, injectable } from "inversify";
import {AppConfigService} from "../../service/app-config/AppConfigService";
import {MongooseService} from "../../service/dal/MongooseService";

export interface IHomeController {
    get(req: Request, res: Response);
}
export function HomeControllerFactory(container: Container) {


    @injectable()
    @controller("")
    class HomeController implements IHomeController {

        protected title: string;
        protected options: {};
        private scripts: string[];

        /**
         * Constructor
         *
         * @class BaseRoute
         * @constructor
         */
        constructor(@inject(TYPES.AppConfigService) private appConfigService: AppConfigService,
                    @inject(TYPES.MongooseService) private mongooseService: MongooseService) {
            // initialize variables
            this.title = "BartTimers";
            this.scripts = [];

            // any keys that need to be reflected in frontend go in api (index.pug injection)
            this.options = {
                "message": "Welcome to BartTimers",
                "keywords": "bart, commute, timeWaster",
                "description": "Help you beat that commute time",
                "api": {
                    "key": "frontend"
                }
            };

        }

        // serve index file
        @httpGet("/")
        public get(req: Request, res: Response) {
            this.home(req, res);
        }

        @httpGet("/bart-user-settings")
        public bartSettings(req: Request, res: Response) {
            this.home(req, res);
        }

        // authenticate requests
        @all("/api/*")
        public api(req: Request, res: Response, next: any) {
            if (req.isAuthenticated()) {
                next();
            } else {
                res.redirect("/");
            }
        }

        private home(req: Request, res: Response) {
            this.render(req, res, "index", this.options);
        }

        /**
         * Add a JS external file to the request.
         *
         * @class BaseRoute
         * @method addScript
         * @param src {string} The src to the external JS file.
         * @return {BaseRoute} Self for chaining
         */
        private addScript(src: string) {
            this.scripts.push(src);
        }

        /**
         * Render a page.
         *
         * @class BaseRoute
         * @method render
         * @param req {Request} The request object.
         * @param res {Response} The response object.
         * @param view {String} The view to render.
         * @param options {Object} Additional options to append to the view's local scope.
         * @return void
         */
        private render(req: Request, res: Response, view: string, options?: {}) {
            // add constants
            res.locals.BASE_URL = "/";

            // add scripts
            res.locals.scripts = this.scripts;

            // add title
            res.locals.title = this.title;

            // render view
            res.render(view, options);
        }

    }

    return HomeController;
}
