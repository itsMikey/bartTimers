// COOKIE NPM MODULE TO HELP WITH PARSING
// credit: https://www.npmjs.com/package/cookie

let decode = decodeURIComponent;
let encode = encodeURIComponent;
let pairSplitRegExp = /; */;


function tryDecode(str, decode) {
    try {
        return decode(str);
    } catch (e) {
        return str;
    }
}

export function cookieParser(str, options?) {
    if (typeof str !== "string") {
        throw new TypeError("argument str must be a string");
    }

    let obj = {};
    let opt = options || {};
    let pairs = str.split(pairSplitRegExp);
    let dec = opt.decode || decode;

    for (let i = 0; i < pairs.length; i++) {
        let pair = pairs[i];
        let eqIDX = pair.indexOf("=");

        // skip things that don't look like key=value
        if (eqIDX < 0) {
            continue;
        }

        let key = pair.substr(0, eqIDX).trim();
        let val = pair.substr(++eqIDX, pair.length).trim();

        // quoted values
        if ('"' === val[0]) {
            val = val.slice(1, -1);
        }

        // only assign once
        if (undefined === obj[key]) {
            obj[key] = tryDecode(val, dec);
        }
    }

    return obj;
}
