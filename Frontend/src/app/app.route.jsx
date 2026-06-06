import { createBrowserRouter } from "react-router";
import {
  ProtectedRoute,
  PublicOnlyRoute,
} from "../features/auth/components/ProtectedRoute";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import Dashboard from "./Dashboard";
import Vendors from "./Vendors";
import Approvals from "./Approvals";
import Activity from "./Activity";

export const router = createBrowserRouter([
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/vendors",
        element: <Vendors />,
      },
      {
        path: "/activity",
        element: <Activity />,
      },
      {
        path: "/approvals",
        element: <Approvals />,
      },
    ],
  },
  {
    element: <PublicOnlyRoute />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
    ],
  },
]);
