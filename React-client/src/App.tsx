import { Route, Routes } from "react-router"
import Login from "./Login"
import ProtectedRoute from "./Components/ProtectedRoutes"
import { Dashboard } from "./Components/Dashboard"
import { AuthProvider } from "./Components/AuthContext"

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route index element={<Login></Login>}></Route>
        <Route element={<ProtectedRoute></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard></Dashboard>}></Route>
          {/* Other protected Routes will be followed here...... */}
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App
