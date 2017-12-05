import * as Chai from "chai";
import "../../../../test-helpers/AppConfigHelper";
import {AppConfigService} from "../AppConfigService";
import {IAppConfig} from "../../../common/constant/interfaces/app-config/IAppConfig";

const expect = Chai.expect;

describe("App Config", () => {
    const appConfigService: AppConfigService = new AppConfigService();
    const appConfig: IAppConfig = appConfigService.getAppConfig();
    it("should get our environment variables", (done) => {
        expect(appConfig.app.isDev, "incorrect isdev environment variable").to.be.false;
        expect(appConfig.app.isProd, "incorrect isProd environment variable").to.be.false;
        expect(appConfig.app.isLocal, "incorrect isLocal environment variable").to.be.false;
        expect(appConfig.app.isTest, "incorrect isTest environment variable").to.be.true;
        expect(appConfig.app.site, "incorrect site environment variable").to.eql("http://bart-timers.test");

        expect(appConfig.bart.apiKey, "incorrect bart apikey environment variable").to.eql("fakeKey");
        expect(appConfig.bart.baseUrl, "incorrect bart baseUrl environment variable").to.eql("http://api.bart.gov/api/");
        expect(appConfig.bart.baseUrl, "incorrect bart baseUrl environment variable").to.eql("http://api.bart.gov/api/");
        done();
    });

});
