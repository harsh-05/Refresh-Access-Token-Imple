import axios from "axios";

const baseURL = "http://localhost:3000";

let _accessToken: string | null = null;

let _handleRefresh: ((token: string)=>void) | null = null;

export function registerCallback(setState: ((token:string)=>void)) {
    _handleRefresh = setState;
}


export function setAccessToken(token: string) {
    _accessToken = token;
}

export const api = axios.create({
    baseURL:baseURL
});


api.interceptors.request.use((config) => {
    // we have to add the accessToken before the every request.....
    if (_accessToken)
        config.headers.Authorization = _accessToken;
    return config;
}, (error)=>Promise.reject(error));


api.interceptors.response.use((response) => response, async (error) => {
    const originalRequest = error.config;

    if (!originalRequest._retry && (error.response.code === 401 || error.response.code === 403)) {

        originalRequest._retry = true;
        
        try{
                const res = await axios.post(`${baseURL}refresh`, {}, { withCredentials: true });
            setAccessToken(res.data.accessToken);
            // here I have to set the context state also.....    
            if (_accessToken && _handleRefresh)
                _handleRefresh(_accessToken)
            
            return api(originalRequest);
               
        } catch (e) {
            return Promise.reject(e);
        }
       
    }
    return Promise.reject(error);
})


