export interface IAppConfig {
    app: {
        isLocal: boolean;
        isDev: boolean;
        isProd: boolean;
        isTest: boolean;
        site: string;
    };
    bart: {
        apiKey: string;
        baseUrl: string;
    };
    workerEndPoint: string;
    dal: {
        mongo: {
            host: string;
            username: string;
            password: string;
        }
    };
}
