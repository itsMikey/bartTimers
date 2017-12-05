import {IAppConfig} from "../../common/constant/interfaces/app-config/IAppConfig";
import {provide} from "../../common/ioc/ioc";
import TYPES from "../../common/constant/types";

export interface IAppConfigService {
    getAppConfig(): IAppConfig;
}

@provide(TYPES.AppConfigService)
export class AppConfigService implements IAppConfigService {

    private static instance: AppConfigService;

    private appConfig: IAppConfig;

    public constructor() {
        if (!AppConfigService.instance) {
            const testAppConfig = process.env.TEST_APP_CONFIG;
            // This is a workaround to allow this class to work using TEST_APP_CONFIG IF defined from TESTS
            this.appConfig = (testAppConfig) ? JSON.parse(testAppConfig) : process.env.APP_CONFIG;
            AppConfigService.instance = this;
        }

    }

    public getAppConfig(): IAppConfig {
        return AppConfigService.instance.appConfig;
    }
}
