import { pool } from "../config/database.js";
import {
  INSERT_APPROVAL_QUERY,
  SELECT_APPROVALS_BY_QUOTATION_QUERY,
  SELECT_APPROVAL_BY_ID_QUERY,
} from "../queries/approval.query.js";

/**
 * Creates an approval record and updates the quotation status inside a transaction.
 */
export async function createApprovalTx(approverId, {
  quotation_id,
  status, // "APPROVED" or "REJECTED" (approval_status enum: 'PENDING', 'APPROVED', 'REJECTED')
  remarks,
}) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // 1. Fetch current quotation status
    const qCheckResult = await client.query("SELECT id, status FROM quotations WHERE id = $1", [quotation_id]);
    const quotation = qCheckResult.rows[0];
    if (!quotation) {
      const err = new Error("Quotation not found");
      err.status = 404;
      throw err;
    }

    if (quotation.status === "SELECTED" || quotation.status === "REJECTED") {
      const err = new Error(`Quotation is already finalized (status: ${quotation.status})`);
      err.status = 400;
      throw err;
    }

    // Map approval status to quotation status
    let newQuoteStatus;
    if (status === "APPROVED") {
      newQuoteStatus = "SELECTED";
    } else if (status === "REJECTED") {
      newQuoteStatus = "REJECTED";
    } else {
      const err = new Error("Invalid approval status. Must be APPROVED or REJECTED.");
      err.status = 400;
      throw err;
    }

    // 2. Update quotation status
    await client.query("UPDATE quotations SET status = $1 WHERE id = $2", [newQuoteStatus, quotation_id]);

    // 3. Insert approval log
    const approvalLevel = 1; // Default level
    const approvedAt = new Date();

    const insertResult = await client.query(INSERT_APPROVAL_QUERY, [
      quotation_id,
      approverId,
      approvalLevel,
      status,
      remarks || null,
      approvedAt,
    ]);

    const approval = insertResult.rows[0];

    await client.query("COMMIT");

    // Fetch full approval details with user context
    const fullResult = await client.query(SELECT_APPROVAL_BY_ID_QUERY, [approval.id]);
    return fullResult.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Lists approval history for a specific quotation.
 */
export async function findApprovalsByQuotation(quotationId) {
  const result = await pool.query(SELECT_APPROVALS_BY_QUOTATION_QUERY, [quotationId]);
  return result.rows;
}

/**
 * Fetches a single approval by ID.
 */
export async function findApprovalById(id) {
  const result = await pool.query(SELECT_APPROVAL_BY_ID_QUERY, [id]);
  return result.rows[0] || null;
}
