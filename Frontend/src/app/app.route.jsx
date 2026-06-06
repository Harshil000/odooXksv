import { createBrowserRouter } from "react-router";

export const router = createBrowserRouter([
    {
        path : '/',
        children : [
            {
                index : true,
                element : <h1>Dashboard</h1>
            }
        ]
    }
])
