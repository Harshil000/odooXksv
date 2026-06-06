import { pool } from "../config/database.js";

// GET /api/activities
export async function getActivitiesController(req, res, next) {
  try {
    const isVendor = req.user?.role === "VENDOR";
    const vendorId = req.user?.vendorId;

    let query = "";
    let params = [];

    if (isVendor) {
      // Vendors only see events scoped to their company
      query = `
        SELECT 'rfq' AS type, 'RFQ published' AS title, 'RFQ ' || r.rfq_number || ' ("' || r.title || '") was published' AS description, r.created_at AS timestamp, 'rfq' AS category
        FROM rfqs r
        JOIN rfq_vendors rv ON r.id = rv.rfq_id
        WHERE rv.vendor_id = $1

        UNION ALL

        SELECT 'quotation' AS type, 'Quotation submitted' AS title, 'Quotation ' || q.quotation_number || ' was submitted for total ₹' || TO_CHAR(q.total_amount, 'FM99,99,999') AS description, q.submitted_at AS timestamp, 'quotations' AS category
        FROM quotations q
        WHERE q.vendor_id = $1

        UNION ALL

        SELECT 'approval' AS type, 'Approval decision' AS title, 'Quotation ' || q.quotation_number || ' was ' || a.status || ' with remarks: "' || COALESCE(a.remarks, '') || '"' AS description, a.approved_at AS timestamp, 'approvals' AS category
        FROM approvals a
        JOIN quotations q ON a.quotation_id = q.id
        WHERE q.vendor_id = $1

        UNION ALL

        SELECT 'vendor' AS type, 'Vendor registered' AS title, 'Your company ' || company_name || ' registered with status ' || status AS description, created_at AS timestamp, 'vendors' AS category
        FROM vendors
        WHERE id = $1

        UNION ALL

        SELECT 'invoice' AS type, 'Invoice created' AS title, 'Invoice ' || i.invoice_number || ' generated for ₹' || TO_CHAR(i.grand_total, 'FM99,99,999') AS description, i.generated_at AS timestamp, 'invoices' AS category
        FROM invoices i
        JOIN purchase_orders po ON i.purchase_order_id = po.id
        JOIN quotations q ON po.quotation_id = q.id
        WHERE q.vendor_id = $1

        UNION ALL

        SELECT 'po' AS type, 'PO issued' AS title, 'Purchase Order ' || po.po_number || ' was issued' AS description, po.created_at AS timestamp, 'purchase_orders' AS category
        FROM purchase_orders po
        JOIN quotations q ON po.quotation_id = q.id
        WHERE q.vendor_id = $1

        ORDER BY timestamp DESC
        LIMIT 100;
      `;
      params = [vendorId];
    } else {
      // Admins/Managers see global logs
      query = `
        SELECT 'rfq' AS type, 'RFQ published' AS title, 'RFQ ' || r.rfq_number || ' ("' || r.title || '") was published' AS description, r.created_at AS timestamp, 'rfq' AS category
        FROM rfqs r

        UNION ALL

        SELECT 'quotation' AS type, 'Quotation submitted' AS title, 'Quotation ' || q.quotation_number || ' was submitted by vendor for ₹' || TO_CHAR(q.total_amount, 'FM99,99,999') AS description, q.submitted_at AS timestamp, 'quotations' AS category
        FROM quotations q

        UNION ALL

        SELECT 'approval' AS type, 'Approval decision' AS title, 'Quotation ' || q.quotation_number || ' was ' || a.status || ' with remarks: "' || COALESCE(a.remarks, '') || '"' AS description, a.approved_at AS timestamp, 'approvals' AS category
        FROM approvals a
        JOIN quotations q ON a.quotation_id = q.id

        UNION ALL

        SELECT 'vendor' AS type, 'Vendor registered' AS title, 'Company ' || company_name || ' registered with status ' || status AS description, created_at AS timestamp, 'vendors' AS category
        FROM vendors

        UNION ALL

        SELECT 'invoice' AS type, 'Invoice created' AS title, 'Invoice ' || i.invoice_number || ' generated for ₹' || TO_CHAR(i.grand_total, 'FM99,99,999') AS description, i.generated_at AS timestamp, 'invoices' AS category
        FROM invoices i

        UNION ALL

        SELECT 'po' AS type, 'PO issued' AS title, 'Purchase Order ' || po.po_number || ' was issued' AS description, po.created_at AS timestamp, 'purchase_orders' AS category
        FROM purchase_orders po

        ORDER BY timestamp DESC
        LIMIT 100;
      `;
    }

    const result = await pool.query(query, params);
    
    // Add dynamic fallbacks for activity logs if DB is freshly seeded
    let activities = result.rows;
    if (activities.length === 0) {
      activities = [
        {
          type: "quotation",
          title: "Quotation selected",
          description: "Infra supplies pvt ltd selected for office furniture q2",
          timestamp: new Date(Date.now() - 3600 * 1000 * 4).toISOString(),
          category: "quotations",
        },
        {
          type: "approval",
          title: "Approval pending",
          description: "PO-2026 awaiting L2 approval by priya shah",
          timestamp: new Date(Date.now() - 3600 * 1000 * 12).toISOString(),
          category: "approvals",
        },
        {
          type: "rfq",
          title: "RFQ published",
          description: "Office furniture Q2 sent to 3 vendors",
          timestamp: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
          category: "rfq",
        },
        {
          type: "vendor",
          title: "Vendor added",
          description: "FastEng transport registered and pending verifications",
          timestamp: new Date(Date.now() - 3600 * 1000 * 30).toISOString(),
          category: "vendors",
        },
        {
          type: "invoice",
          title: "Invoice created",
          description: "INV-2025-001 generated for PO-2026 from Infra Supplies",
          timestamp: new Date(Date.now() - 3600 * 1000 * 48).toISOString(),
          category: "invoices",
        }
      ];
    }

    return res.status(200).json(activities);
  } catch (err) {
    next(err);
  }
}
