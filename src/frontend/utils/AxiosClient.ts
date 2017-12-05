import axios from "axios";
const API_ROOT = "@BACKEND_API@";

const responseBody = (res) => res.data;
const err = (err) => err;

export const httpRequest = {
    get: (url) =>
        axios.get(`${API_ROOT}${url}`).then(responseBody) as Promise<any>,
    post: (url, data) =>
        axios.post(`${API_ROOT}${url}`, data).then(responseBody).catch(err) as Promise<any>
};
