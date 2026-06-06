import { pool } from "../config/database.js";
import { SELECT_ACTIVE_VENDORS_QUERY } from "../queries/vendor.query.js";

export async function findActiveVendors() {
  const result = await pool.query(SELECT_ACTIVE_VENDORS_QUERY);
  return result.rows;
}
