import {IRegisterApiReq} from "../src/common/api/register/IRegisterApiReq";
import {IUser, User} from "../src/models/User/User";

export function randomStringGenerator() {
    return Math.random().toString(36).substring(7);
}

export const userRegistrationMocker = (): IRegisterApiReq => {
    return {
        userSession: {
            _id: "",
            id: "",
            email: ""
        },
        data: {
            firstName: "Rick",
            lastName: "Sanchez",
            email: randomStringGenerator() + "@bart-timerz.xyz",
            password: randomStringGenerator()
        }
    };
};


export const dbUserMock = (): Promise<IUser> => {
    return User.register(userRegistrationMocker())
        .then((user) => {
           return Promise.resolve(user);
        })
        .catch((err) => {
            console.log(err);
            return Promise.reject(err);
        });
}