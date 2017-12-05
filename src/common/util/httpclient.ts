const client = require ("node-rest-client").Client;

export class HttpClient {
    httpClient: any;

    constructor(args: any) {
        this.httpClient = new client(args);
    }

    public doGet(url: string, args: any): any {

        return new Promise((resolve, reject) => {
            this.httpClient.get(url, args, (data, response) => {
                // parsed response body as js object
                resolve(data);
            }).on("error", (err) => {
                reject(err);
            });
        });
    }


    public doPost(url: string, args: any): any {

        return new Promise((resolve, reject) => {
            this.httpClient.post(url, args, (data, response) => {
                // parsed response body as js object
                resolve(data);
            }).on("error", (err) => {
                reject(err);
            });
        });
    }

    public doPut(url: string, args: any): any {

        return new Promise((resolve, reject) => {
            this.httpClient.put(url, args, (data, response) => {
                // parsed response body as js object
                resolve(data);
            }).on("error", (err) => {
                reject(err);
            });
        });
    }


    public doDelete(url: string, args: any): any {

        return new Promise((resolve, reject) => {
            this.httpClient.delete(url, args, (data, response) => {
                // parsed response body as js object
                resolve(data);
            }).on("error", (err) => {
                reject(err);
            });
        });
    }

    public doPatch(url: string, args: any): any {

        return new Promise((resolve, reject) => {
            this.httpClient.patch(url, args, (data, response) => {
                // parsed response body as js object
                resolve(data);
            }).on("error", (err) => {
                reject(err);
            });
        });
    }

}
