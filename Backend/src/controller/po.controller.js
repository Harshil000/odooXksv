import {
  createPoAndInvoiceTx,
  findPoById,
  findInvoiceById,
  findPurchaseOrders,
  findInvoices,
} from "../repository/po.repository.js";
import { pool } from "../config/database.js";
import { sendInvoiceEmail } from "../utils/email.util.js";

/**
 * Generates a Purchase Order and an Invoice for a selected quotation.
 * POST /api/purchase-orders
 */
export async function generatePoAndInvoice(req, res, next) {
  try {
    // Role validation: Vendors are not allowed to generate POs/Invoices
    if (req.user.role === "VENDOR") {
      return res.status(403).json({ message: "Forbidden: Only procurement staff can generate purchase orders and invoices" });
    }

    const { quotation_id } = req.body;
    if (!quotation_id) {
      return res.status(400).json({ message: "quotation_id is required" });
    }

    const result = await createPoAndInvoiceTx(Number(quotation_id));

    // Asynchronously send the email to avoid blocking the client response
    (async () => {
      try {
        const fullInvoice = await findInvoiceById(result.invoice.id);
        if (fullInvoice) {
          // Fetch vendor email
          const userRes = await pool.query(
            "SELECT u.email FROM users u JOIN vendors v ON v.user_id = u.id WHERE v.id = $1",
            [fullInvoice.vendor_id]
          );
          const toEmail = userRes.rows[0]?.email;

          // Fetch items
          const itemsRes = await pool.query(`
            SELECT qi.id, p.product_name, ri.quantity, qi.unit_price, qi.total_price, p.unit
            FROM quotation_items qi
            JOIN rfq_items ri ON qi.rfq_item_id = ri.id
            JOIN products p ON ri.product_id = p.id
            WHERE qi.quotation_id = $1
          `, [fullInvoice.quotation_id]);
          const items = itemsRes.rows;

          if (toEmail) {
            await sendInvoiceEmail({ toEmail, invoice: fullInvoice, items });
          } else {
            console.warn(`⚠️ No email found for vendor ID ${fullInvoice.vendor_id}`);
          }
        }
      } catch (err) {
        console.error("❌ Error in automatic invoice email sending:", err.message);
      }
    })();

    return res.status(201).json({
      message: "Purchase Order and Invoice generated successfully",
      ...result,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Returns a list of all purchase orders (filtered for vendors).
 * GET /api/purchase-orders
 */
export async function getPurchaseOrders(req, res, next) {
  try {
    if (req.user.role === "VENDOR") {
      const vendorId = Number(req.user.vendor_id);
      const pos = await findPurchaseOrders({ vendor_id: vendorId });
      return res.status(200).json(pos);
    }

    const pos = await findPurchaseOrders();
    return res.status(200).json(pos);
  } catch (error) {
    next(error);
  }
}

/**
 * Returns detailed specifications of a purchase order.
 * GET /api/purchase-orders/:id
 */
export async function getPoDetails(req, res, next) {
  try {
    const { id } = req.params;
    const po = await findPoById(Number(id));
    if (!po) {
      return res.status(404).json({ message: "Purchase Order not found" });
    }

    // Security check: Vendor can only view their own PO
    if (req.user.role === "VENDOR" && Number(po.vendor_id) !== Number(req.user.vendor_id)) {
      return res.status(403).json({ message: "Forbidden: You do not own this purchase order" });
    }

    return res.status(200).json(po);
  } catch (error) {
    next(error);
  }
}

/**
 * Returns a list of all invoices (filtered for vendors).
 * GET /api/invoices
 */
export async function getInvoices(req, res, next) {
  try {
    if (req.user.role === "VENDOR") {
      const vendorId = Number(req.user.vendor_id);
      const invoices = await findInvoices({ vendor_id: vendorId });
      return res.status(200).json(invoices);
    }

    const invoices = await findInvoices();
    return res.status(200).json(invoices);
  } catch (error) {
    next(error);
  }
}

/**
 * Returns detailed specifications of an invoice.
 * GET /api/invoices/:id
 */
export async function getInvoiceDetails(req, res, next) {
  try {
    const { id } = req.params;
    const invoice = await findInvoiceById(Number(id));
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    // Security check: Vendor can only view their own invoice
    if (req.user.role === "VENDOR" && Number(invoice.vendor_id) !== Number(req.user.vendor_id)) {
      return res.status(403).json({ message: "Forbidden: You do not own this invoice" });
    }

    return res.status(200).json(invoice);
  } catch (error) {
    next(error);
  }
}
