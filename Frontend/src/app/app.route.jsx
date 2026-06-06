import { createBrowserRouter } from "react-router";
import { ProtectedRoute, PublicOnlyRoute } from "../features/auth/components/ProtectedRoute";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import Dashboard from "./Dashboard";
import Layout from "../shared/components/Layout";
import QuotationSubmission from "../features/quotations/pages/QuotationSubmission";
import QuotationComparison from "../features/quotations/pages/QuotationComparison";
import ReportsAnalytics from "../features/reports/pages/ReportsAnalytics";

// Import pages for other features (to be created)
// import VendorManagement from "../features/vendors/pages/VendorManagement";
// import RFQList from "../features/rfq/pages/RFQList";
// import ApprovalWorkflow from "../features/approvals/pages/ApprovalWorkflow";
// import PurchaseOrderGeneration from "../features/purchase-orders/pages/PurchaseOrderGeneration";
// import InvoiceManagement from "../features/invoices/pages/InvoiceManagement";
// import ActivityLogs from "../features/activity/pages/ActivityLogs";
// import Reports from "../features/reports/pages/Reports";

export const router = createBrowserRouter([
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <Layout><Dashboard /></Layout>,
      },
      {
        path: "/dashboard",
        element: <Layout><Dashboard /></Layout>,
      },
      {
        path: "/quotations",
        element: <Layout><QuotationSubmission /></Layout>,
      },
      {
        path: "/quotations/submit/:rfqId",
        element: <Layout><QuotationSubmission /></Layout>,
      },
      {
        path: "/quotations/edit/:quotationId",
        element: <Layout><QuotationSubmission /></Layout>,
      },
      { 
      path: "/quotations/compare/:rfqId",
      element: <Layout><QuotationComparison /></Layout>
      },
      {
         path: "/reports",
         element: <Layout><ReportsAnalytics /></Layout>,
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
