import { pool } from "../config/database.js";
import { generateRfqNumber } from "../utils/rfq.utils.js";
import {
  INSERT_RFQ_QUERY,
  INSERT_PRODUCT_QUERY,
  INSERT_RFQ_ITEM_QUERY,
  INSERT_RFQ_VENDOR_QUERY,
  SELECT_ALL_RFQS_QUERY,
  SELECT_RFQ_BY_ID_QUERY,
  SELECT_RFQ_ITEMS_QUERY,
  SELECT_RFQ_VENDORS_QUERY,
  UPDATE_RFQ_QUERY,
  DELETE_RFQ_ITEMS_QUERY,
  DELETE_RFQ_VENDORS_QUERY,
} from "../queries/rfq.query.js";

export async function createRfqTx({
  title,
  description,
  deadline,
  created_by,
  items = [],
  vendor_ids = [],
}) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // 1. Generate unique RFQ number
    const rfqNumber = generateRfqNumber();
    const status = "OPEN"; // Default status for created RFQ

    // 2. Insert RFQ
    const rfqResult = await client.query(INSERT_RFQ_QUERY, [
      rfqNumber,
      title,
      description || null,
      deadline,
      status,
      created_by,
    ]);
    const rfq = rfqResult.rows[0];

    // 3. Process items and insert them
    const insertedItems = [];
    for (const item of items) {
      const { product_name, description: prodDesc, unit, quantity } = item;

      // Find or insert product
      const productResult = await client.query(INSERT_PRODUCT_QUERY, [
        product_name.trim(),
        prodDesc ? prodDesc.trim() : null,
        unit ? unit.trim() : "Units",
      ]);
      const product = productResult.rows[0];

      // Link product to RFQ
      const itemResult = await client.query(INSERT_RFQ_ITEM_QUERY, [
        rfq.id,
        product.id,
        quantity,
      ]);
      insertedItems.push({
        ...itemResult.rows[0],
        product_name: product.product_name,
        unit: product.unit,
      });
    }

    // 4. Map vendors to RFQ
    const insertedVendors = [];
    for (const vendorId of vendor_ids) {
      const vendorResult = await client.query(INSERT_RFQ_VENDOR_QUERY, [
        rfq.id,
        vendorId,
      ]);
      insertedVendors.push(vendorResult.rows[0]);
    }

    await client.query("COMMIT");

    return {
      ...rfq,
      items: insertedItems,
      vendors: insertedVendors,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function findAllRfqs() {
  const result = await pool.query(SELECT_ALL_RFQS_QUERY);
  return result.rows;
}

export async function findRfqById(id) {
  const rfqResult = await pool.query(SELECT_RFQ_BY_ID_QUERY, [id]);
  if (rfqResult.rows.length === 0) {
    return null;
  }
  const rfq = rfqResult.rows[0];

  const itemsResult = await pool.query(SELECT_RFQ_ITEMS_QUERY, [id]);
  const vendorsResult = await pool.query(SELECT_RFQ_VENDORS_QUERY, [id]);

  return {
    ...rfq,
    items: itemsResult.rows,
    vendors: vendorsResult.rows,
  };
}

export async function updateRfqTx(
  id,
  { title, description, deadline, status, items = [], vendor_ids = [] }
) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // 1. Update basic RFQ fields
    const rfqResult = await client.query(UPDATE_RFQ_QUERY, [
      title,
      description || null,
      deadline,
      status || "OPEN",
      id,
    ]);
    
    if (rfqResult.rows.length === 0) {
      throw new Error("RFQ not found");
    }
    const rfq = rfqResult.rows[0];

    // 2. Delete existing items
    await client.query(DELETE_RFQ_ITEMS_QUERY, [id]);

    // 3. Re-insert items
    const insertedItems = [];
    for (const item of items) {
      const { product_name, description: prodDesc, unit, quantity } = item;

      // Find or insert product
      const productResult = await client.query(INSERT_PRODUCT_QUERY, [
        product_name.trim(),
        prodDesc ? prodDesc.trim() : null,
        unit ? unit.trim() : "Units",
      ]);
      const product = productResult.rows[0];

      // Link product to RFQ
      const itemResult = await client.query(INSERT_RFQ_ITEM_QUERY, [
        id,
        product.id,
        quantity,
      ]);
      insertedItems.push({
        ...itemResult.rows[0],
        product_name: product.product_name,
        unit: product.unit,
      });
    }

    // 4. Delete existing vendors mapping
    await client.query(DELETE_RFQ_VENDORS_QUERY, [id]);

    // 5. Re-map vendors
    const insertedVendors = [];
    for (const vendorId of vendor_ids) {
      const vendorResult = await client.query(INSERT_RFQ_VENDOR_QUERY, [
        id,
        vendorId,
      ]);
      insertedVendors.push(vendorResult.rows[0]);
    }

    await client.query("COMMIT");

    return {
      ...rfq,
      items: insertedItems,
      vendors: insertedVendors,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
