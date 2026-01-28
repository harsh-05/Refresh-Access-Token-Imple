import { createContext, useEffect, useState } from "react";
import { _setAccessToken, baseURL, registerCallback } from "../config/api";
import axios from "axios";

export const AuthContext = createContext < {accessToken:string | undefined, setAccesToken: Function}  | undefined>(undefined);

export function AuthProvider({ children }: {children:React.ReactNode}) {
    const [accessToken, setAccesToken] = useState<string | undefined>(undefined); 
    const [isloading, setLoading] = useState(true);
    useEffect(() => {
        registerCallback(setAccesToken);
    }, [])

    // This effect to check for the changes happened in the accessToken
    useEffect(() => {
        console.log(accessToken);
    }, [accessToken]);

    useEffect(() => {
        async function fetch() {
            try {
                const res = await axios.post(`${baseURL}/refresh`, {}, { withCredentials: true});
                if (res.data.accessToken) {
                    setAccesToken(res.data.accessToken);
                    _setAccessToken(res.data.accessToken);
                }
            } catch (e) {
                console.log(e);
            } finally {
                setLoading(false);
            }
        }
        if (!accessToken) {
            fetch();
        }
    }, [])
   
    return <AuthContext value={{ accessToken, setAccesToken }}>{isloading? <div> is Loading.....</div>: children}</AuthContext>
}
