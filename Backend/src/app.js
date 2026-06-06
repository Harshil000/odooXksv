import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { handleError } from "./middleware/error.middleware.js";
import authRoute from "./routes/auth.route.js";
import rfqRoute from "./routes/rfq.route.js";
import vendorRoute from "./routes/vendors.route.js";
import categoryRoute from "./routes/category.route.js";
import quotationRoute from "./routes/quotation.route.js";
import approvalRoute from "./routes/approval.route.js";
import negotiationRoute from "./routes/negotiation.route.js";
import poRoute from "./routes/po.route.js";
import invoiceRoute from "./routes/invoice.route.js";
import adminRoute from "./routes/admin.route.js";
import dashboardRoute from "./routes/dashboard.route.js";
import reportsRoute from "./routes/reports.route.js";
import activitiesRoute from "./routes/activities.route.js";
import morgan from "morgan";




const app = express();

const configuredOrigins = String(process.env.CORS_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  if (configuredOrigins.length === 0) return true;
  if (configuredOrigins.includes(origin)) return true;
  if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin)) return true;
  if (
    /^https?:\/\/(192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+)(:\d+)?$/i.test(
      origin,
    )
  )
    return true;
  return false;
};

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);
app.use(morgan("dev"));

// =========================
// ROUTES
// =========================
app.use("/api/auth", authRoute);
app.use("/api/rfq", rfqRoute);
app.use("/api/vendors", vendorRoute);
app.use("/api/categories", categoryRoute);
app.use("/api/quotations", quotationRoute);
app.use("/api/approvals", approvalRoute);
app.use("/api/negotiations", negotiationRoute);
app.use("/api/purchase-orders", poRoute);
app.use("/api/invoices", invoiceRoute);
app.use("/api/admin", adminRoute);
app.use("/api/dashboard", dashboardRoute);
app.use("/api/reports", reportsRoute);
app.use("/api/activities", activitiesRoute);

// =========================
// HEALTH CHECK
// =========================
app.get("/api/health", (req, res) => {
  res.send("🚀 KSV Backend Running");
});

// =========================
// GLOBAL ERROR HANDLER
// =========================
app.use(handleError);

export default app;
