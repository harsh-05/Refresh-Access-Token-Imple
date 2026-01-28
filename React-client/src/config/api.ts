import axios from "axios";

export const baseURL = "http://localhost:3000";

let _accessToken: string | null = null;

let _handleRefresh: ((token: string | undefined)=>void) | null = null;

export function registerCallback(setState: ((token: string | undefined)=>void)) {
    _handleRefresh = setState;
}


export function _setAccessToken(token: string) {
    _accessToken = token;
}

export const api = axios.create({
    baseURL: baseURL,
    withCredentials: true
});


api.interceptors.request.use((config) => {
    // we have to add the accessToken before the every request.....
    if (_accessToken)
        config.headers.Authorization = _accessToken;
    return config;
}, (error)=>Promise.reject(error));



let isRefreshing = false;
let pendingRequest: any[] = [];

function processPendingRequests(token:string| null, error:unknown | null) {
    if (token) {
        pendingRequest.forEach(resolve=>(resolve(token)))
    } else {
        pendingRequest.forEach(reject=>(reject(error)))
    }
}

api.interceptors.response.use((response) => response, async (error) => {
    const originalRequest = error.config;

    if (!originalRequest._retry && (error.response.code === 401 || error.response.code === 403)) {

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                pendingRequest.push({resolve, reject})
            }).then((token) => {
                originalRequest.header.Authorisation = token;
                return api(originalRequest);
            }).catch((error: Error) => {
                return Promise.reject(error);
            })
        }

        originalRequest._retry = true;
        isRefreshing = true;
        
        try{
            const res = await axios.post(`${baseURL}/refresh`, {}, { withCredentials: true });
            _setAccessToken(res.data.accessToken);
            // here I have to set the context state also.....    
            if (_accessToken && _handleRefresh) {
                _handleRefresh(_accessToken);  
                processPendingRequests(_accessToken, null);
            }

            return api(originalRequest);
               
        } catch (e) {

            processPendingRequests(null, e);
            //here we have to clear the react state too...
            if(_handleRefresh)
            _handleRefresh(undefined)
            return Promise.reject(e);
        } finally {
            isRefreshing = false;
        }
       
    }
    return Promise.reject(error);
})


