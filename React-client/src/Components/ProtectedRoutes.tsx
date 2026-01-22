import { useContext} from "react";
import { Navigate, Outlet } from "react-router";
import { AuthContext } from "./AuthContext";

export default function ProtectedRoute() {
    const accessToken = useContext(AuthContext);
    
    console.log(accessToken?.accessToken);
    
    return !accessToken?.accessToken ? (
      <Navigate to={"/"} replace></Navigate>
    ) : (
      <Outlet></Outlet>
    ); 
}