import { useContext } from "react"
import { AuthContext } from "./AuthContext"

export function Dashboard() {
    const auth = useContext(AuthContext);
    console.log(auth?.accessToken);
    return <div>
            In the Dashboard........
        </div>
}