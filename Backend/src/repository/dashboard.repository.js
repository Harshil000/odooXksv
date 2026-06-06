import { pool } from "../config/database.js";
import {
  SELECT_ACTIVE_RFQS_COUNT_GLOBAL,
  SELECT_PENDING_APPROVALS_COUNT_GLOBAL,
  SELECT_PO_SUM_THIS_MONTH_GLOBAL,
  SELECT_OVERDUE_INVOICES_COUNT_GLOBAL,
  SELECT_RECENT_POS_GLOBAL,
  SELECT_ACTIVE_RFQS_COUNT_VENDOR,
  SELECT_PENDING_APPROVALS_COUNT_VENDOR,
  SELECT_PO_SUM_THIS_MONTH_VENDOR,
  SELECT_OVERDUE_INVOICES_COUNT_VENDOR,
  SELECT_RECENT_POS_VENDOR,
} from "../queries/dashboard.query.js";

/**
 * Compiles dashboard metrics based on user role and vendor context.
 */
export async function getDashboardStats(role, vendorId = null) {
  const isVendor = role === "VENDOR";
  const vId = vendorId ? Number(vendorId) : null;

  let activeRfqsQuery, pendingApprovalsQuery, poSumQuery, overdueInvoicesQuery, recentPosQuery;
  let params = [];

  if (isVendor) {
    if (!vId) {
      throw new Error("Vendor profile context is missing for vendor role dashboard query");
    }
    activeRfqsQuery = SELECT_ACTIVE_RFQS_COUNT_VENDOR;
    pendingApprovalsQuery = SELECT_PENDING_APPROVALS_COUNT_VENDOR;
    poSumQuery = SELECT_PO_SUM_THIS_MONTH_VENDOR;
    overdueInvoicesQuery = SELECT_OVERDUE_INVOICES_COUNT_VENDOR;
    recentPosQuery = SELECT_RECENT_POS_VENDOR;
    params = [vId];
  } else {
    activeRfqsQuery = SELECT_ACTIVE_RFQS_COUNT_GLOBAL;
    pendingApprovalsQuery = SELECT_PENDING_APPROVALS_COUNT_GLOBAL;
    poSumQuery = SELECT_PO_SUM_THIS_MONTH_GLOBAL;
    overdueInvoicesQuery = SELECT_OVERDUE_INVOICES_COUNT_GLOBAL;
    recentPosQuery = SELECT_RECENT_POS_GLOBAL;
  }

  // Run all queries concurrently for performance
  const [
    activeRfqsRes,
    pendingApprovalsRes,
    poSumRes,
    overdueInvoicesRes,
    recentPosRes,
  ] = await Promise.all([
    pool.query(activeRfqsQuery, params),
    pool.query(pendingApprovalsQuery, params),
    pool.query(poSumQuery, params),
    pool.query(overdueInvoicesQuery, params),
    pool.query(recentPosQuery, params),
  ]);

  return {
    activeRfqsCount: Number(activeRfqsRes.rows[0]?.count || 0),
    pendingApprovalsCount: Number(pendingApprovalsRes.rows[0]?.count || 0),
    poSumThisMonth: Number(poSumRes.rows[0]?.sum || 0),
    overdueInvoicesCount: Number(overdueInvoicesRes.rows[0]?.count || 0),
    recentPurchaseOrders: recentPosRes.rows.map(row => ({
      id: row.id,
      po_number: row.po_number,
      issue_date: row.issue_date,
      status: row.status,
      total_amount: Number(row.total_amount),
      company_name: row.company_name,
    })),
  };
}
