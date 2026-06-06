import { pool } from "../config/database.js";

// GET /api/reports
export async function getReportsDataController(req, res, next) {
  try {
    const isVendor = req.user?.role === "VENDOR";
    const vendorId = req.user?.vendorId;

    // 1. Fetch total RFQs count
    let rfqCountQuery = "SELECT COUNT(*) FROM rfqs";
    let rfqCountParams = [];
    if (isVendor) {
      rfqCountQuery = `
        SELECT COUNT(DISTINCT r.id) 
        FROM rfqs r 
        JOIN rfq_vendors rv ON r.id = rv.rfq_id 
        WHERE rv.vendor_id = $1
      `;
      rfqCountParams = [vendorId];
    }
    const rfqCountResult = await pool.query(rfqCountQuery, rfqCountParams);
    const totalRfqs = Number(rfqCountResult.rows[0]?.count || 0);

    // 2. Fetch active vendors count
    const activeVendorsResult = await pool.query(
      "SELECT COUNT(*) FROM vendors WHERE status = 'ACTIVE'"
    );
    const activeVendors = Number(activeVendorsResult.rows[0]?.count || 0);

    // 3. PO Fulfillment Rate
    let fulfillmentQuery = `
      SELECT 
        COUNT(CASE WHEN status = 'COMPLETED' THEN 1 END) AS completed,
        COUNT(*) AS total
      FROM purchase_orders
    `;
    let fulfillmentParams = [];
    if (isVendor) {
      fulfillmentQuery = `
        SELECT 
          COUNT(CASE WHEN po.status = 'COMPLETED' THEN 1 END) AS completed,
          COUNT(po.id) AS total
        FROM purchase_orders po
        JOIN quotations q ON po.quotation_id = q.id
        WHERE q.vendor_id = $1
      `;
      fulfillmentParams = [vendorId];
    }
    const fulfillmentResult = await pool.query(fulfillmentQuery, fulfillmentParams);
    const completedPos = Number(fulfillmentResult.rows[0]?.completed || 0);
    const totalPos = Number(fulfillmentResult.rows[0]?.total || 0);
    const poFulfillment = totalPos > 0 ? Math.round((completedPos / totalPos) * 100) : 0;

    // 4. Overdue Invoices count
    let overdueQuery = "SELECT COUNT(*) FROM invoices WHERE status != 'PAID'";
    let overdueParams = [];
    if (isVendor) {
      overdueQuery = `
        SELECT COUNT(i.id) 
        FROM invoices i
        JOIN purchase_orders po ON i.purchase_order_id = po.id
        JOIN quotations q ON po.quotation_id = q.id
        WHERE q.vendor_id = $1 AND i.status != 'PAID'
      `;
      overdueParams = [vendorId];
    }
    const overdueResult = await pool.query(overdueQuery, overdueParams);
    const overdueInvoices = Number(overdueResult.rows[0]?.count || 0);

    // 5. Spend By Category
    let spendByCatQuery = `
      SELECT 
        CASE 
          WHEN p.product_name ILIKE '%laptop%' OR p.product_name ILIKE '%keyboard%' OR p.product_name ILIKE '%mouse%' OR p.product_name ILIKE '%monitor%' OR p.product_name ILIKE '%pc%' OR p.product_name ILIKE '%server%' OR p.product_name ILIKE '%hardware%' OR p.product_name ILIKE '%software%' THEN 'IT Hardware'
          WHEN p.product_name ILIKE '%chair%' OR p.product_name ILIKE '%table%' OR p.product_name ILIKE '%desk%' OR p.product_name ILIKE '%sofa%' OR p.product_name ILIKE '%furniture%' OR p.product_name ILIKE '%cabinet%' OR p.product_name ILIKE '%shelf%' THEN 'Furniture'
          WHEN p.product_name ILIKE '%pen%' OR p.product_name ILIKE '%paper%' OR p.product_name ILIKE '%notebook%' OR p.product_name ILIKE '%stapler%' OR p.product_name ILIKE '%marker%' OR p.product_name ILIKE '%pencil%' OR p.product_name ILIKE '%stationery%' OR p.product_name ILIKE '%file%' THEN 'Stationery'
          ELSE 'Logistics'
        END AS category_name,
        SUM(qi.total_price) AS spend
      FROM purchase_orders po
      JOIN quotations q ON po.quotation_id = q.id
      JOIN quotation_items qi ON qi.quotation_id = q.id
      JOIN rfq_items ri ON qi.rfq_item_id = ri.id
      JOIN products p ON ri.product_id = p.id
    `;
    let spendByCatParams = [];
    if (isVendor) {
      spendByCatQuery += " WHERE q.vendor_id = $1 ";
      spendByCatParams = [vendorId];
    }
    spendByCatQuery += " GROUP BY category_name ";

    const spendByCatResult = await pool.query(spendByCatQuery, spendByCatParams);
    
    // Genuine category structure (starts at 0)
    const categoriesBaseline = {
      "IT Hardware": 0,
      "Furniture": 0,
      "Stationery": 0,
      "Logistics": 0
    };

    spendByCatResult.rows.forEach(row => {
      const name = row.category_name || "Logistics";
      categoriesBaseline[name] = Number(row.spend || 0);
    });

    const spendByCategory = Object.entries(categoriesBaseline).map(([name, spend]) => ({
      name,
      spend
    })).sort((a, b) => b.spend - a.spend);

    // 6. Top Vendors by Spend
    let topVendorsQuery = `
      SELECT v.company_name AS vendor, SUM(q.total_amount) AS spend, COUNT(po.id) AS pos
      FROM purchase_orders po
      JOIN quotations q ON po.quotation_id = q.id
      JOIN vendors v ON q.vendor_id = v.id
    `;
    let topVendorsParams = [];
    if (isVendor) {
      topVendorsQuery += " WHERE q.vendor_id = $1 ";
      topVendorsParams = [vendorId];
    }
    topVendorsQuery += `
      GROUP BY v.company_name
      ORDER BY spend DESC
      LIMIT 5
    `;

    const topVendorsResult = await pool.query(topVendorsQuery, topVendorsParams);
    const topVendors = topVendorsResult.rows.map(row => ({
      vendor: row.vendor,
      spend: Number(row.spend || 0),
      pos: Number(row.pos || 0)
    }));

    // 7. Monthly Spend Chart
    let chartQuery = `
      SELECT TO_CHAR(po.created_at, 'Mon') as month, SUM(q.total_amount) as spend, MIN(po.created_at) as sort_date
      FROM purchase_orders po
      JOIN quotations q ON po.quotation_id = q.id
    `;
    let chartParams = [];
    if (isVendor) {
      chartQuery += " WHERE q.vendor_id = $1 ";
      chartParams = [vendorId];
    }
    chartQuery += `
      GROUP BY TO_CHAR(po.created_at, 'Mon')
      ORDER BY sort_date ASC
    `;
    const chartResult = await pool.query(chartQuery, chartParams);
    
    // Last 6 months baseline starting at 0
    const monthNames = ["Dec", "Jan", "Feb", "Mar", "Apr", "May"];
    const monthBaselines = {
      Dec: 0,
      Jan: 0,
      Feb: 0,
      Mar: 0,
      Apr: 0,
      May: 0
    };

    chartResult.rows.forEach(row => {
      if (monthBaselines[row.month] !== undefined) {
        monthBaselines[row.month] = Number(row.spend || 0);
      }
    });

    const monthlySpend = monthNames.map(m => ({
      month: m,
      spend: monthBaselines[m]
    }));

    return res.status(200).json({
      success: true,
      data: {
        totalRfqs,
        activeVendors,
        poFulfillment,
        overdueInvoices,
        spendByCategory,
        topVendors,
        monthlySpend
      }
    });
  } catch (err) {
    next(err);
  }
}
