import { createContext, useState } from "react";

const AuthContext = createContext < {accessToken:string | undefined, setAccesToken: Function}  | undefined>(undefined);

export function AuthProvider({ children }: {children:React.ReactNode}) {
    const [accessToken, setAccesToken] = useState<string | undefined>(undefined);
    return <AuthContext value={{ accessToken, setAccesToken }}>{children}</AuthContext>
}