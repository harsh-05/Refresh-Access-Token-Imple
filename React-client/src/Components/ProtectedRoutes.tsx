import { Outlet } from "react-router";

export default function ProtectedRoute() {
    return <div>
        <Outlet></Outlet>
    </div>
       
   
}