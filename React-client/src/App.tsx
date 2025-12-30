import { Route, Routes } from "react-router"
import Login from "./Login"
import ProtectedRoute from "./Components/ProtectedRoutes"

function App() {
  return (
    <Routes>
      <Route index element={<Login></Login>}></Route>
      <Route element={<ProtectedRoute></ProtectedRoute>}>
        <Route path="/dashboard" element></Route>
        {/* Other protected Routes will be followed here...... */}
      </Route>
   </Routes>
  )
}

export default App
