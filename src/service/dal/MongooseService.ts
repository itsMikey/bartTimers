
import TYPES from "../../common/constant/types";
import { inject } from "inversify";
import { provideSingleton } from "../../common/ioc/ioc";
import {AppConfigService} from "../app-config/AppConfigService";
import * as Promise from "bluebird";
import mongoose = require("mongoose");
mongoose.Promise = Promise;

@provideSingleton(TYPES.MongooseService)
export class MongooseService {

    public static readyState(): number {
        return mongoose.connection.readyState;
    }

    private static instance: MongooseService;

    constructor(@inject(TYPES.AppConfigService) private appConfigService: AppConfigService) {
        if (!MongooseService.instance) {
            mongoose.connect(appConfigService.getAppConfig().dal.mongo.host, {
                // auth: {
                //     user: appConfigService.getAppConfig().dal.mongo.username,
                //     password: appConfigService.getAppConfig().dal.mongo.password
                // }c
            }, (err) => {
                if (err) {
                    console.log(err);
                }
            });
            MongooseService.instance = this;
        }
    }


}
