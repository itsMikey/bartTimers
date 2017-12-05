import * as passport from "passport";
import {IUser, syncDoesPasswordMatch, User} from "../../../models/User/User";
import {inject} from "inversify";
import TYPES from "../../../common/constant/types";
import {provide} from "../../../common/ioc/ioc";
import {MongooseService} from "../../../service/dal/MongooseService";
import {ERROR_CODES} from "../../../common/constant/error-codes";

const LocalStrategy = require("passport-local").Strategy;

interface IAuthService {
    initialize();
}

@provide(TYPES.AuthService)
export class AuthService implements IAuthService {

    constructor(@inject(TYPES.MongooseService) private mongooseService: MongooseService) {
    }

    public initialize() {
        passport.use(new LocalStrategy({
                usernameField: "email"
            },
            (email, password, done) => {
                User.findOne({email: email}, (err, user) => {
                    if (err) {
                        console.log(err);
                        return done(err);
                    }
                    if (!user) {
                        return done(null, false, {message: "Incorrect username."});
                    }

                    if (syncDoesPasswordMatch(password, user.password)) {
                        // success
                            return done(null, user);
                    } else {
                        // incorrect password
                        return done(null, false, {message: ERROR_CODES.LOGIN.INCORRECT_CREDENTIALS});
                    }
                });
            }
        ));

        passport.serializeUser((user: IUser, done) => {
            done(null, user._id);
        });

        passport.deserializeUser((id, done) => {
            User.findById(id, (err, user) => {
                done(err, user);
            });
        });
    }

}
