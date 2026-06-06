import { pool } from "../config/database.js";
import { generateQuotationNumber } from "../utils/quotation.util.js";
import {
  INSERT_QUOTATION_QUERY,
  INSERT_QUOTATION_ITEM_QUERY,
  SELECT_RFQ_VENDOR_CHECK_QUERY,
  SELECT_RFQ_STATUS_CHECK_QUERY,
  SELECT_QUOTATION_BY_ID_QUERY,
  SELECT_QUOTATION_ITEMS_QUERY,
  SELECT_QUOTATIONS_QUERY,
  SELECT_QUOTATIONS_BY_VENDOR_QUERY,
  SELECT_QUOTATIONS_BY_RFQ_QUERY,
  SELECT_QUOTATION_BY_RFQ_AND_VENDOR_QUERY,
  UPDATE_QUOTATION_QUERY,
  DELETE_QUOTATION_ITEMS_QUERY,
  SELECT_RFQ_ITEM_QUANTITY_QUERY,
} from "../queries/quotation.query.js";

// Helper: Fetches a quotation and its line items
async function getFullQuotation(client, quotationId) {
  const qResult = await client.query(SELECT_QUOTATION_BY_ID_QUERY, [quotationId]);
  const quotation = qResult.rows[0];
  if (!quotation) return null;

  const itemsResult = await client.query(SELECT_QUOTATION_ITEMS_QUERY, [quotationId]);
  quotation.items = itemsResult.rows;
  return quotation;
}

/**
 * Creates a new Quotation inside a secure database transaction.
 */
export async function createQuotationTx(vendorId, {
  rfq_id,
  delivery_days,
  notes,
  items = [],
  status = "SUBMITTED",
}) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // 1. Check if RFQ exists and check status/deadline
    const rfqCheck = await client.query(SELECT_RFQ_STATUS_CHECK_QUERY, [rfq_id]);
    const rfq = rfqCheck.rows[0];
    if (!rfq) {
      const err = new Error("RFQ not found");
      err.status = 404;
      throw err;
    }

    if (rfq.evaluated_status !== "OPEN") {
      const err = new Error(`Quotations can only be submitted for OPEN RFQs. This RFQ is ${rfq.evaluated_status}.`);
      err.status = 400;
      throw err;
    }

    // 2. Check if the vendor is invited to this RFQ
    const vendorCheck = await client.query(SELECT_RFQ_VENDOR_CHECK_QUERY, [rfq_id, vendorId]);
    if (vendorCheck.rowCount === 0) {
      const err = new Error("Vendor is not assigned/invited to submit a quotation for this RFQ");
      err.status = 403;
      throw err;
    }

    // 3. Check if vendor has already submitted a quotation
    const dupCheck = await client.query(SELECT_QUOTATION_BY_RFQ_AND_VENDOR_QUERY, [rfq_id, vendorId]);
    if (dupCheck.rowCount > 0) {
      const err = new Error("You have already submitted a quotation for this RFQ. Please update the existing one instead.");
      err.status = 409;
      throw err;
    }

    // 4. Generate unique quotation number
    const qtnNumber = generateQuotationNumber();
    const submittedAt = status === "SUBMITTED" ? new Date() : null;

    // 5. Insert base quotation with total_amount = 0
    const insertQResult = await client.query(INSERT_QUOTATION_QUERY, [
      qtnNumber,
      rfq_id,
      vendorId,
      0, // Initial amount
      delivery_days || null,
      notes || null,
      status,
      submittedAt,
    ]);
    const quotation = insertQResult.rows[0];

    // 6. Insert items & calculate totals
    let grandTotal = 0;
    const insertedItems = [];

    for (const item of items) {
      const { rfq_item_id, unit_price } = item;

      // Validate that item exists and belongs to the RFQ, fetch quantity
      const qtyResult = await client.query(SELECT_RFQ_ITEM_QUANTITY_QUERY, [rfq_item_id, rfq_id]);
      const rfqItem = qtyResult.rows[0];
      if (!rfqItem) {
        const err = new Error(`Invalid RFQ Item ID: ${rfq_item_id}`);
        err.status = 400;
        throw err;
      }

      const quantity = Number(rfqItem.quantity);
      const uPrice = Number(unit_price);
      if (isNaN(uPrice) || uPrice < 0) {
        const err = new Error(`Invalid unit price for RFQ item ID ${rfq_item_id}`);
        err.status = 400;
        throw err;
      }

      const totalLinePrice = uPrice * quantity;
      grandTotal += totalLinePrice;

      const itemResult = await client.query(INSERT_QUOTATION_ITEM_QUERY, [
        quotation.id,
        rfq_item_id,
        uPrice,
        totalLinePrice,
      ]);
      insertedItems.push(itemResult.rows[0]);
    }

    // 7. Update base quotation with final grand total
    await client.query("UPDATE quotations SET total_amount = $1 WHERE id = $2", [
      grandTotal,
      quotation.id,
    ]);

    await client.query("COMMIT");

    // Retrieve full quotation details
    const fullQuotation = await getFullQuotation(client, quotation.id);
    return fullQuotation;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Updates an existing Quotation inside a secure database transaction.
 */
export async function updateQuotationTx(id, vendorId, {
  delivery_days,
  notes,
  items = [],
  status = "SUBMITTED",
}) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // 1. Fetch current quotation and check ownership
    const qCheckResult = await client.query("SELECT rfq_id, vendor_id, status FROM quotations WHERE id = $1", [id]);
    const currentQ = qCheckResult.rows[0];
    if (!currentQ) {
      const err = new Error("Quotation not found");
      err.status = 404;
      throw err;
    }

    if (Number(currentQ.vendor_id) !== Number(vendorId)) {
      const err = new Error("Unauthorized: You do not own this quotation");
      err.status = 403;
      throw err;
    }

    // 2. Check if RFQ is still OPEN
    const rfqCheck = await client.query(SELECT_RFQ_STATUS_CHECK_QUERY, [currentQ.rfq_id]);
    const rfq = rfqCheck.rows[0];
    if (!rfq || rfq.evaluated_status !== "OPEN") {
      const err = new Error("Quotations can only be updated while the RFQ is OPEN");
      err.status = 400;
      throw err;
    }

    const submittedAt = status === "SUBMITTED" ? new Date() : null;

    // 3. Clear old line items
    await client.query(DELETE_QUOTATION_ITEMS_QUERY, [id]);

    // 4. Insert new items and calculate totals
    let grandTotal = 0;
    for (const item of items) {
      const { rfq_item_id, unit_price } = item;

      // Validate RFQ Item membership and quantity
      const qtyResult = await client.query(SELECT_RFQ_ITEM_QUANTITY_QUERY, [rfq_item_id, currentQ.rfq_id]);
      const rfqItem = qtyResult.rows[0];
      if (!rfqItem) {
        const err = new Error(`Invalid RFQ Item ID: ${rfq_item_id}`);
        err.status = 400;
        throw err;
      }

      const quantity = Number(rfqItem.quantity);
      const uPrice = Number(unit_price);
      if (isNaN(uPrice) || uPrice < 0) {
        const err = new Error(`Invalid unit price for RFQ item ID ${rfq_item_id}`);
        err.status = 400;
        throw err;
      }

      const totalLinePrice = uPrice * quantity;
      grandTotal += totalLinePrice;

      await client.query(INSERT_QUOTATION_ITEM_QUERY, [
        id,
        rfq_item_id,
        uPrice,
        totalLinePrice,
      ]);
    }

    // 5. Update base quotation details
    await client.query(UPDATE_QUOTATION_QUERY, [
      grandTotal,
      delivery_days || null,
      notes || null,
      status,
      submittedAt,
      id,
    ]);

    await client.query("COMMIT");

    const fullQuotation = await getFullQuotation(client, id);
    return fullQuotation;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Finds a specific quotation by ID (including items).
 */
export async function findQuotationById(id) {
  const client = await pool.connect();
  try {
    const fullQuotation = await getFullQuotation(client, id);
    return fullQuotation;
  } finally {
    client.release();
  }
}

/**
 * Finds a specific quotation by RFQ and Vendor ID.
 */
export async function findQuotationByRfqAndVendor(rfqId, vendorId) {
  const client = await pool.connect();
  try {
    const result = await client.query(SELECT_QUOTATION_BY_RFQ_AND_VENDOR_QUERY, [rfqId, vendorId]);
    const quotation = result.rows[0];
    if (!quotation) return null;
    return await getFullQuotation(client, quotation.id);
  } finally {
    client.release();
  }
}

/**
 * Finds all quotations matching filter criteria.
 */
export async function findQuotations({ vendor_id, rfq_id } = {}) {
  if (vendor_id) {
    const result = await pool.query(SELECT_QUOTATIONS_BY_VENDOR_QUERY, [vendor_id]);
    return result.rows;
  }
  if (rfq_id) {
    const result = await pool.query(SELECT_QUOTATIONS_BY_RFQ_QUERY, [rfq_id]);
    return result.rows;
  }
  const result = await pool.query(SELECT_QUOTATIONS_QUERY);
  return result.rows;
}
