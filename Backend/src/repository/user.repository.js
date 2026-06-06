import { pool } from "../config/database.js";
import argon2 from "argon2";
import {
  SELECT_USER_BY_EMAIL_QUERY,
  INSERT_USER_QUERY,
  INSERT_VENDOR_QUERY,
  SELECT_USER_BY_ID_QUERY,
  SELECT_ALL_USERS_QUERY,
  UPDATE_USER_STATUS_QUERY,
  UPDATE_VENDOR_STATUS_QUERY,
} from "../queries/user.query.js";

export async function createUser({
  name,
  full_name,
  email,
  password,
  role,
  company_name,
  gst_number,
  contact_person,
  phone,
  address,
}) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const normalizedEmail = email.trim().toLowerCase();
    const finalFullName = (full_name || name || "").trim();
    const upperRole = (role || "VENDOR").toUpperCase();

    // Verify role is one of the valid enums
    const validRoles = ["ADMIN", "PROCUREMENT_OFFICER", "MANAGER", "VENDOR"];
    if (!validRoles.includes(upperRole)) {
      const err = new Error(`Invalid role. Must be one of: ${validRoles.join(", ")}`);
      err.status = 400;
      throw err;
    }

    const passwordHash = await argon2.hash(password);

    const userIsActive = upperRole === "ADMIN";

    // Insert user
    const userResult = await client.query(INSERT_USER_QUERY, [
      finalFullName,
      normalizedEmail,
      passwordHash,
      upperRole,
      userIsActive,
    ]);
    const createdUser = userResult.rows[0];

    let vendorDetails = null;

    // If role is VENDOR, create the vendor record as well
    if (upperRole === "VENDOR") {
      const finalCompanyName = (company_name || `${finalFullName}'s Company`).trim();
      const vendorStatus = userIsActive ? "ACTIVE" : "INACTIVE";
      const vendorResult = await client.query(INSERT_VENDOR_QUERY, [
        createdUser.id,
        finalCompanyName,
        gst_number || null,
        contact_person || finalFullName,
        phone || null,
        address || null,
        vendorStatus,
      ]);
      vendorDetails = vendorResult.rows[0];
    }

    await client.query("COMMIT");

    return {
      id: createdUser.id,
      full_name: createdUser.full_name,
      email: createdUser.email,
      role: createdUser.role,
      is_active: createdUser.is_active,
      created_at: createdUser.created_at,
      ...(vendorDetails
        ? {
            vendor_id: vendorDetails.id,
            company_name: vendorDetails.company_name,
            gst_number: vendorDetails.gst_number,
            contact_person: vendorDetails.contact_person,
            phone: vendorDetails.phone,
            address: vendorDetails.address,
            rating: vendorDetails.rating,
            vendor_status: vendorDetails.status,
          }
        : {}),
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function findUserByEmail(email) {
  const result = await pool.query(SELECT_USER_BY_EMAIL_QUERY, [email]);
  return result.rows[0] || null;
}

export async function findUserById(id) {
  const result = await pool.query(SELECT_USER_BY_ID_QUERY, [id]);
  return result.rows[0] || null;
}

export async function findAllUsers() {
  const result = await pool.query(SELECT_ALL_USERS_QUERY);
  return result.rows;
}

export async function updateUserStatusTx(userId, isActive) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Update user is_active
    const userRes = await client.query(UPDATE_USER_STATUS_QUERY, [userId, isActive]);
    if (userRes.rowCount === 0) {
      const err = new Error(`User with ID ${userId} not found`);
      err.status = 404;
      throw err;
    }
    const updatedUser = userRes.rows[0];

    // If role is VENDOR, sync its vendor status
    if (updatedUser.role === "VENDOR") {
      const vendorStatus = isActive ? "ACTIVE" : "INACTIVE";
      await client.query(UPDATE_VENDOR_STATUS_QUERY, [userId, vendorStatus]);
    }

    await client.query("COMMIT");

    // Return the full updated user profile
    const fullUserRes = await client.query(SELECT_USER_BY_ID_QUERY, [userId]);
    return fullUserRes.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
