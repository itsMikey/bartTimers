import {cookieParser} from "./CookieParser";
import {ERROR_CODES} from "../../common/constant/error-codes";

// Not used currently. Could be used for guest browsing site
class CookieBaker {
    public setCookie(name: string, value: any) {
        const cookie = [name, "=", JSON.stringify(value), "; domain=.", window.location.host.toString(), "; path=/;"].join("");
        document.cookie = cookie;
    }

    public getCookie(name = "") {
         let cookies = cookieParser(document.cookie);
         if (!name) {
             return cookies;
         } else {
             return (cookies[name]) ? cookies[name] : ERROR_CODES.COOKIES.NOT_FOUND;
         }
    }
    public deleteCookie(name: string) {
        document.cookie = [name, "=; expires=Thu, 01-Jan-1970 00:00:01 GMT; path=/; domain=.", window.location.host.toString()].join("");
    }
}

export default new CookieBaker();



