import {IAppConfig} from "../src/common/constant/interfaces/app-config/IAppConfig";

const fs = require("fs");
const merge = require("webpack-merge");
const yaml = require("js-yaml");

const environmentName = process.env.NODE_ENV || "test";

const APP_CONFIG: IAppConfig = merge(
    yaml.safeLoad(fs.readFileSync("./config/env/common.yml"), "utf-8"),
    yaml.safeLoad(fs.readFileSync("./config/env/" + environmentName + ".yml"), "utf-8")
);

// Override the process.env.TEST_APP_CONFIG variable
process.env.TEST_APP_CONFIG = JSON.stringify(APP_CONFIG);
