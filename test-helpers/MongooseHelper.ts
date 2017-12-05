import "./AppConfigHelper";
import mongoose = require("mongoose");
import * as assert from "assert";
import * as Promise from "bluebird";
import {AppConfigService} from "../src/service/app-config/AppConfigService";

mongoose.Promise = Promise;

interface IMongoose {
    createConnection(): void;

    closeConnection(): void;

    deleteData(): void;
}

const reconnectTimeout = 10000;


class MongooseHelper implements IMongoose {

    public static bootstrap(): IMongoose {
        if (!MongooseHelper.instance) {
            MongooseHelper.instance = new MongooseHelper();
        }
        return MongooseHelper.instance;
    }

    private static instance: IMongoose;
    private appConfigService: AppConfigService;

    public constructor() {
        this.appConfigService = new AppConfigService();
    }


    public createConnection(): void {
        try {
            if (mongoose.connection.readyState === 0 || mongoose.connection.readyState === 3) {
                mongoose.connect(`mongodb://${this.appConfigService.getAppConfig().dal.mongo.username}:${this.appConfigService.getAppConfig().dal.mongo.password}@${this.appConfigService.getAppConfig().dal.mongo.host}` + "?authSource=admin", {
                    server: {
                        socketOptions: {
                            socketTimeoutMS: 0,
                            connectTimeoutMS: 0
                        }
                    }
                }).catch((err) => {
                    console.log(err);
                });
            }
            const db = mongoose.connection;

            db.on("connecting", () => {
                console.info("Connecting to MongoDB...");
            });

            db.on("error", (error) => {
                console.error(`MongoDB connection error: ${error}`);
                mongoose.disconnect();
            });

            db.on("connected", () => {
                console.info("Connected to MongoDB!");
            });

            db.once("open", () => {
                console.info("MongoDB connection opened!");
            });

            db.on("reconnected", () => {
                console.info("MongoDB reconnected!");
            });

            db.on("disconnected", () => {
                console.error(`MongoDB disconnected! Reconnecting in ${reconnectTimeout / 1000}s...`);
                setTimeout(() => this.createConnection(), reconnectTimeout);
            });
        } catch (e) {
            console.log(e);
        }

    }

    public deleteData(): void {
        mongoose.connection.db.dropDatabase().then((data) => {
            assert(data);
        }).catch((err) => {
            console.log(err);
        });
    }

    public closeConnection(): void {
        Promise.resolve(mongoose.connection.close());
    }
}

export const mongooseHelper = MongooseHelper.bootstrap();
