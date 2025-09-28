import { Route, Routes } from "react-router";
import LoginPage from "../pages/login/LoginPage";


export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage/>}></Route>
        </Routes>
    );
}