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
import Approvals from "../features/approval/pages/Approvals";
import Activity from "../features/activity/pages/Activity";
import UserApprovals from "../features/user-approval/pages/UserApprovals";
import Quotations from "../features/quotation/pages/Quotations";
import PurchaseOrders from "../features/purchase-order/pages/PurchaseOrders";
import Invoices from "../features/invoice/pages/Invoices";
import Reports from "../features/reports/pages/Reports";

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
        path: "/quotations",
        element: <Quotations />,
      },
      {
        path: "/activity",
        element: <Activity />,
      },
      {
        path: "/approvals",
        element: <Approvals />,
      },
      {
        path: "/admin/approvals",
        element: <UserApprovals />,
      },
      {
        path: "/purchase-orders",
        element: <PurchaseOrders />,
      },
      {
        path: "/invoices",
        element: <Invoices />,
      },
      {
        path: "/reports",
        element: <Reports />,
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
