import { pool } from "../config/database.js";
import {
  INSERT_NEGOTIATION_QUERY,
  SELECT_NEGOTIATIONS_BY_QUOTATION_QUERY,
} from "../queries/negotiation.query.js";

/**
 * Creates a negotiation log and sets the quotation status to UNDER_NEGOTIATION in a transaction.
 */
export async function createNegotiationTx(senderUserId, {
  quotation_id,
  proposed_amount,
  message,
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

    // Block negotiation if quote is already finalized
    if (quotation.status === "SELECTED" || quotation.status === "REJECTED") {
      const err = new Error(`Cannot negotiate: Quotation is already finalized (status: ${quotation.status})`);
      err.status = 400;
      throw err;
    }

    // 2. Insert negotiation message
    const amount = proposed_amount ? Number(proposed_amount) : null;
    if (amount !== null && (isNaN(amount) || amount < 0)) {
      const err = new Error("Proposed amount must be a positive number");
      err.status = 400;
      throw err;
    }

    if (!message || !message.trim()) {
      const err = new Error("Message text is required");
      err.status = 400;
      throw err;
    }

    const insertResult = await client.query(INSERT_NEGOTIATION_QUERY, [
      quotation_id,
      senderUserId,
      amount,
      message.trim(),
    ]);
    const negotiation = insertResult.rows[0];

    // 3. Set quotation status to UNDER_NEGOTIATION
    await client.query("UPDATE quotations SET status = 'UNDER_NEGOTIATION' WHERE id = $1", [quotation_id]);

    await client.query("COMMIT");

    // Retrieve details with user context
    const fullResult = await client.query(`
      SELECT n.id, n.quotation_id, n.sender_user_id, n.proposed_amount, n.message, n.created_at,
             u.full_name AS sender_name, u.email AS sender_email, u.role AS sender_role
      FROM negotiations n
      JOIN users u ON n.sender_user_id = u.id
      WHERE n.id = $1
    `, [negotiation.id]);

    return fullResult.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Finds all negotiation messages for a specific quotation in chronological order.
 */
export async function findNegotiationsByQuotation(quotationId) {
  const result = await pool.query(SELECT_NEGOTIATIONS_BY_QUOTATION_QUERY, [quotationId]);
  return result.rows;
}
