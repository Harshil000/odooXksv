export const INSERT_PO_QUERY = `
INSERT INTO purchase_orders (po_number, quotation_id, issue_date, status)
VALUES ($1, $2, $3, $4)
RETURNING id, po_number, quotation_id, issue_date, status, created_at;
`;

export const INSERT_INVOICE_QUERY = `
INSERT INTO invoices (invoice_number, purchase_order_id, subtotal, tax_amount, grand_total, status)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING id, invoice_number, purchase_order_id, subtotal, tax_amount, grand_total, status, generated_at;
`;

export const UPDATE_RFQ_STATUS_TO_AWARDED_QUERY = `
UPDATE rfqs
SET status = 'AWARDED'
WHERE id = (SELECT rfq_id FROM quotations WHERE id = $1)
RETURNING id, rfq_number, status;
`;

export const SELECT_PO_BY_ID_QUERY = `
SELECT po.id, po.po_number, po.quotation_id, po.issue_date, po.status, po.created_at,
       q.quotation_number, q.total_amount, q.delivery_days, q.rfq_id, q.vendor_id,
       v.company_name, v.gst_number, v.contact_person, v.phone,
       r.rfq_number, r.title AS rfq_title
FROM purchase_orders po
JOIN quotations q ON po.quotation_id = q.id
JOIN vendors v ON q.vendor_id = v.id
JOIN rfqs r ON q.rfq_id = r.id
WHERE po.id = $1;
`;

export const SELECT_PO_BY_QUOTATION_QUERY = `
SELECT id, po_number, quotation_id, issue_date, status, created_at
FROM purchase_orders
WHERE quotation_id = $1;
`;

export const SELECT_INVOICE_BY_ID_QUERY = `
SELECT inv.id, inv.invoice_number, inv.purchase_order_id, po.quotation_id, inv.subtotal, inv.tax_amount, inv.grand_total, inv.status, inv.generated_at,
       po.po_number, po.issue_date,
       q.quotation_number, q.rfq_id, q.vendor_id,
       v.company_name, v.gst_number,
       r.rfq_number, r.title AS rfq_title
FROM invoices inv
JOIN purchase_orders po ON inv.purchase_order_id = po.id
JOIN quotations q ON po.quotation_id = q.id
JOIN vendors v ON q.vendor_id = v.id
JOIN rfqs r ON q.rfq_id = r.id
WHERE inv.id = $1;
`;

export const SELECT_ALL_POS_QUERY = `
SELECT po.id, po.po_number, po.quotation_id, po.issue_date, po.status, po.created_at,
       q.quotation_number, q.total_amount,
       v.company_name,
       r.rfq_number, r.title AS rfq_title
FROM purchase_orders po
JOIN quotations q ON po.quotation_id = q.id
JOIN vendors v ON q.vendor_id = v.id
JOIN rfqs r ON q.rfq_id = r.id
ORDER BY po.created_at DESC;
`;

export const SELECT_POS_BY_VENDOR_QUERY = `
SELECT po.id, po.po_number, po.quotation_id, po.issue_date, po.status, po.created_at,
       q.quotation_number, q.total_amount,
       v.company_name,
       r.rfq_number, r.title AS rfq_title
FROM purchase_orders po
JOIN quotations q ON po.quotation_id = q.id
JOIN vendors v ON q.vendor_id = v.id
JOIN rfqs r ON q.rfq_id = r.id
WHERE q.vendor_id = $1
ORDER BY po.created_at DESC;
`;

export const SELECT_ALL_INVOICES_QUERY = `
SELECT inv.id, inv.invoice_number, inv.purchase_order_id, inv.subtotal, inv.tax_amount, inv.grand_total, inv.status, inv.generated_at,
       po.po_number,
       q.quotation_number,
       v.company_name,
       r.rfq_number
FROM invoices inv
JOIN purchase_orders po ON inv.purchase_order_id = po.id
JOIN quotations q ON po.quotation_id = q.id
JOIN vendors v ON q.vendor_id = v.id
JOIN rfqs r ON q.rfq_id = r.id
ORDER BY inv.generated_at DESC;
`;

export const SELECT_INVOICES_BY_VENDOR_QUERY = `
SELECT inv.id, inv.invoice_number, inv.purchase_order_id, inv.subtotal, inv.tax_amount, inv.grand_total, inv.status, inv.generated_at,
       po.po_number,
       q.quotation_number,
       v.company_name,
       r.rfq_number
FROM invoices inv
JOIN purchase_orders po ON inv.purchase_order_id = po.id
JOIN quotations q ON po.quotation_id = q.id
JOIN vendors v ON q.vendor_id = v.id
JOIN rfqs r ON q.rfq_id = r.id
WHERE q.vendor_id = $1
ORDER BY inv.generated_at DESC;
`;
