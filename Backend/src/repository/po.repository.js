import { pool } from "../config/database.js";
import { generatePoNumber, generateInvoiceNumber } from "../utils/po.util.js";
import {
  INSERT_PO_QUERY,
  INSERT_INVOICE_QUERY,
  SELECT_PO_BY_ID_QUERY,
  SELECT_PO_BY_QUOTATION_QUERY,
  SELECT_INVOICE_BY_ID_QUERY,
  SELECT_ALL_POS_QUERY,
  SELECT_POS_BY_VENDOR_QUERY,
  SELECT_ALL_INVOICES_QUERY,
  SELECT_INVOICES_BY_VENDOR_QUERY,
  UPDATE_RFQ_STATUS_TO_AWARDED_QUERY,
} from "../queries/po.query.js";

/**
 * Auto-generates a Purchase Order and Invoice for a SELECTED (approved) quotation.
 */
export async function createPoAndInvoiceTx(quotationId) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // 1. Fetch quotation and verify status
    const qCheck = await client.query("SELECT id, status, total_amount, rfq_id FROM quotations WHERE id = $1", [quotationId]);
    const quotation = qCheck.rows[0];
    if (!quotation) {
      const err = new Error("Quotation not found");
      err.status = 404;
      throw err;
    }

    if (quotation.status !== "SELECTED") {
      const err = new Error(`Quotation must be SELECTED (approved) to generate PO and Invoice. Current status is ${quotation.status}.`);
      err.status = 400;
      throw err;
    }

    // 2. Check if a Purchase Order already exists for this quotation
    const poCheck = await client.query(SELECT_PO_BY_QUOTATION_QUERY, [quotationId]);
    if (poCheck.rowCount > 0) {
      const err = new Error("Purchase Order and Invoice have already been generated for this quotation.");
      err.status = 409;
      throw err;
    }

    // 3. Insert Purchase Order
    const poNum = generatePoNumber();
    const issueDate = new Date();
    const poResult = await client.query(INSERT_PO_QUERY, [
      poNum,
      quotationId,
      issueDate,
      "ISSUED", // Default po_status
    ]);
    const po = poResult.rows[0];

    // 4. Calculate Invoice amounts
    const subtotal = Number(quotation.total_amount);
    const taxAmount = Number((subtotal * 0.18).toFixed(2)); // Standard 18% GST
    const grandTotal = Number((subtotal + taxAmount).toFixed(2));
    const invNum = generateInvoiceNumber();

    // 5. Insert Invoice
    const invResult = await client.query(INSERT_INVOICE_QUERY, [
      invNum,
      po.id,
      subtotal,
      taxAmount,
      grandTotal,
      "GENERATED", // Default invoice_status
    ]);
    const invoice = invResult.rows[0];

    // 6. Update corresponding RFQ status to 'AWARDED'
    await client.query(UPDATE_RFQ_STATUS_TO_AWARDED_QUERY, [quotationId]);

    await client.query("COMMIT");

    return {
      purchaseOrder: po,
      invoice,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Fetches a purchase order by its ID.
 */
export async function findPoById(id) {
  const result = await pool.query(SELECT_PO_BY_ID_QUERY, [id]);
  return result.rows[0] || null;
}

/**
 * Fetches an invoice by its ID.
 */
export async function findInvoiceById(id) {
  const result = await pool.query(SELECT_INVOICE_BY_ID_QUERY, [id]);
  return result.rows[0] || null;
}

/**
 * Lists purchase orders with dynamic filters.
 */
export async function findPurchaseOrders({ vendor_id } = {}) {
  if (vendor_id) {
    const result = await pool.query(SELECT_POS_BY_VENDOR_QUERY, [vendor_id]);
    return result.rows;
  }
  const result = await pool.query(SELECT_ALL_POS_QUERY);
  return result.rows;
}

/**
 * Lists invoices with dynamic filters.
 */
export async function findInvoices({ vendor_id } = {}) {
  if (vendor_id) {
    const result = await pool.query(SELECT_INVOICES_BY_VENDOR_QUERY, [vendor_id]);
    return result.rows;
  }
  const result = await pool.query(SELECT_ALL_INVOICES_QUERY);
  return result.rows;
}
