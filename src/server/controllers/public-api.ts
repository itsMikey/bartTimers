import {controller, httpGet, httpPost} from "inversify-express-utils";
import {Container, inject, injectable} from "inversify";
import * as passport from "passport";
import TYPES from "../../common/constant/types";
import {IRegisterApiReq} from "../../common/api/register/IRegisterApiReq";
import {UserService} from "../../service/user/UserService";
import {ApiHandlerService} from "../../service/api-handler/ApiHandlerService";
import {Request, Response} from "express";
import {BartStationService} from "../../service/bart-station/BartStationService";
import {ERROR_CODES} from "../../common/constant/error-codes";
import {IPlanRoute} from "../../common/constant/interfaces/bart/Routes/IPlanRoute";
import {IClientFacingRoutesResponse} from "../../common/api/route/IClientFacingRoute";
import {IBartStationRes} from "../../common/api/bart-station/IBartStationRes";
import {IUser} from "../../models/User/User";

export interface IPublicApiController {
    login(req, res, next);

    routePlanner(req): Promise<IClientFacingRoutesResponse>;

    getAllPublicStations(): Promise<IBartStationRes>;

    register(req, res?): Promise<any>;
}

let self;

export function PublicApiControllerFactory(container: Container) {

    @injectable()
    @controller("/public-api")
    class PublicApiController implements IPublicApiController {
        public self = this;

        constructor(@inject(TYPES.ApiHandlerService) private apiHandlerService: ApiHandlerService,
                    @inject(TYPES.UserService) private userService: UserService,
                    @inject(TYPES.BartStationService) private bartStationService: BartStationService) {
            self = this;
        }


        @httpGet("/get-stations")
        public getAllPublicStations(): Promise<IBartStationRes> {

            return this.bartStationService.getAllStations()
                .then((stations) => {
                    return this.apiHandlerService.returnData({
                        stations: stations
                    });
                })
                .catch((err) => {
                    console.log(err);
                    return Promise.reject(err);
                });

        }

        @httpGet("/plan-route/:dest/:orig/:time")
        public routePlanner(req): Promise<IClientFacingRoutesResponse> {
            const routePlan: IPlanRoute = this.apiHandlerService.extractParamsApiRequest(req);
            return this.bartStationService.routePlanner(routePlan)
                .then((routes) => {
                    return this.apiHandlerService.returnData(routes) as IClientFacingRoutesResponse;
                })
                .catch((err) => {
                    console.log(err);
                    return Promise.reject(err);
                });
        }

        @httpPost("/login", (req, res, next) => {
            // custom callback
            passport.authenticate("local", (err, user, info) => {

                if (err) {
                    return res.send(self.apiHandlerService.returnErr(ERROR_CODES.UNEXPECTED_ERROR));
                } else if (!user) {
                    return res.send(self.apiHandlerService.returnErr(ERROR_CODES.LOGIN.INCORRECT_CREDENTIALS));
                } else {
                    // have to manually log in user with custom callback
                    return new Promise((resolve, reject) => {
                        req.login((user), (err) => {
                            if (err) {
                                return reject(err);
                            } else {
                                // send client facing user object
                                return self.userService.getUserForClient(req.user._id)
                                    .then((clientFacingUserObj) => {

                                        return res.send(self.apiHandlerService.returnData({
                                            loggedIn: req.isAuthenticated(),
                                            ...clientFacingUserObj
                                        }));
                                    });
                            }
                        });
                    });
                }
            })(req, res, next);
        })
        public login() {
            // login
        }

        // to check if user is authenticated
        @httpGet("/me")
        public getUser(req: Request) {
            if (!req.isAuthenticated()) {
                return this.apiHandlerService.returnData(
                    {
                        loggedIn: req.isAuthenticated(),
                        firstName: null,
                        lastName: null,
                        email: null,
                        stations: {
                            homeStation: null,
                            homeStationArrival: null,
                            destinationArrival: null,
                            destinationStation: null
                        }
                    } as IUser
                );
            } else {
                return this.userService.getUserForClient(req.user._id)
                    .then((clientFacingUserObj) => {
                        return Promise.resolve(this.apiHandlerService.returnData({
                            loggedIn: req.isAuthenticated(),
                            ...clientFacingUserObj
                        }));
                    })
                    .catch((err) => {
                        console.log(err);
                        return Promise.reject(err);
                    });
            }
        }

        @httpPost("/register")
        public register(req, res?): Promise<any> {
            const registerRequest: IRegisterApiReq = this.apiHandlerService.extractApiRequest(req);

            return this.userService.registerUser(registerRequest)
                .then((user: IUser) => {
                    return this.userService.getUserForClient(user._id)
                        .then((clientFacingUserObj: IUser) => {
                            return new Promise((resolve, reject) => {
                                req.login((user), (err): any => {
                                    if (err) {
                                        return reject(err);
                                    } else {
                                        return resolve(this.apiHandlerService.returnData({
                                            loggedIn: req.isAuthenticated(),
                                            ...clientFacingUserObj
                                        }));
                                    }
                                });
                            });
                        })
                        .catch((err) => {
                            console.log(err);
                            return this.apiHandlerService.returnErr(err);
                        });
                })
                .catch((err) => {
                    console.log(err);
                    return this.apiHandlerService.returnErr(err);
                });
        }
    }

    return PublicApiController;
}

