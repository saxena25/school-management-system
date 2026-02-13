import { createBrowserRouter } from "react-router-dom";
import Auth, { authLoader } from "../screens/auth";

export const router = createBrowserRouter([
    {
        path: "/",
        loader: authLoader,
        Component: Auth 
    }
])