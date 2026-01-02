import { createContext, useEffect, useState } from "react";
import { registerCallback } from "../config/api";

const AuthContext = createContext < {accessToken:string | undefined, setAccesToken: Function}  | undefined>(undefined);

export function AuthProvider({ children }: {children:React.ReactNode}) {
    const [accessToken, setAccesToken] = useState<string | undefined>(undefined); 
    useEffect(() => {
        registerCallback(setAccesToken);
    }, [])

    // This effect to check for the changes happened in the accessToken
    useEffect(() => {
        console.log(accessToken);
    }, [accessToken]);
   
    return <AuthContext value={{ accessToken, setAccesToken }}>{children}</AuthContext>
}
