import { createBrowserRouter } from "react-router";
import {
  ProtectedRoute,
  PublicOnlyRoute,
} from "../features/auth/components/ProtectedRoute";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import Dashboard from "./Dashboard";
import Rfq from "../features/rfq/pages/Rfq";
import CreateRfq from "../features/rfq/pages/CreateRfq";
import RfqDetails from "../features/rfq/pages/RfqDetails";
import EditRfq from "../features/rfq/pages/EditRfq";
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
        path: "/rfqs",
        element: <Rfq />,
      },
      {
        path: "/rfq/create",
        element: <CreateRfq />,
      },
      {
        path: "/rfq/:id",
        element: <RfqDetails />,
      },
      {
        path: "/rfq/:id/edit",
        element: <EditRfq />,
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
