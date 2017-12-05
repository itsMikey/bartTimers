/*
Middleware allowing us to intercept and transform actions,
we intercept actions whose payload property is a promise.
 */

const promiseMiddleware: any = (store) => (next) => (action) => {
    if (isPromise(action.payload)) {
        action.payload.then(
            (res) => {
                action.payload = res.data || res;
                store.dispatch(action);
            },
            (error) => {
                action.error = true;
                action.payload = error.response.body;
                store.dispatch(action);
            }
        );
        return;
    }
    next(action);
};

function isPromise(v) {
    return v && typeof v.then === "function";
}

export {
    promiseMiddleware
};
