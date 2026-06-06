export const INSERT_QUOTATION_QUERY = `
INSERT INTO quotations (quotation_number, rfq_id, vendor_id, total_amount, delivery_days, notes, status, submitted_at)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
RETURNING id, quotation_number, rfq_id, vendor_id, total_amount, delivery_days, notes, status, submitted_at;
`;

export const INSERT_QUOTATION_ITEM_QUERY = `
INSERT INTO quotation_items (quotation_id, rfq_item_id, unit_price, total_price)
VALUES ($1, $2, $3, $4)
RETURNING id, quotation_id, rfq_item_id, unit_price, total_price;
`;

export const SELECT_RFQ_VENDOR_CHECK_QUERY = `
SELECT 1 FROM rfq_vendors
WHERE rfq_id = $1 AND vendor_id = $2;
`;

export const SELECT_RFQ_STATUS_CHECK_QUERY = `
SELECT r.id, r.deadline, r.status,
       CASE 
         WHEN r.deadline < CURRENT_TIMESTAMP AND r.status = 'OPEN' THEN 'CLOSED'::rfq_status
         ELSE r.status 
       END AS evaluated_status
FROM rfqs r
WHERE r.id = $1;
`;

export const SELECT_QUOTATION_BY_ID_QUERY = `
SELECT q.id, q.quotation_number, q.rfq_id, q.vendor_id, q.total_amount, q.delivery_days, q.notes, q.status, q.submitted_at,
       v.company_name, v.gst_number, v.contact_person, v.phone, v.address,
       r.rfq_number, r.title AS rfq_title, r.deadline AS rfq_deadline
FROM quotations q
JOIN vendors v ON q.vendor_id = v.id
JOIN rfqs r ON q.rfq_id = r.id
WHERE q.id = $1;
`;

export const SELECT_QUOTATION_ITEMS_QUERY = `
SELECT qi.id, qi.quotation_id, qi.rfq_item_id, qi.unit_price, qi.total_price,
       ri.quantity, p.product_name, p.unit
FROM quotation_items qi
JOIN rfq_items ri ON qi.rfq_item_id = ri.id
JOIN products p ON ri.product_id = p.id
WHERE qi.quotation_id = $1;
`;

export const SELECT_QUOTATIONS_QUERY = `
SELECT q.id, q.quotation_number, q.rfq_id, q.vendor_id, q.total_amount, q.delivery_days, q.notes, q.status, q.submitted_at,
       v.company_name, v.gst_number,
       r.rfq_number, r.title AS rfq_title
FROM quotations q
JOIN vendors v ON q.vendor_id = v.id
JOIN rfqs r ON q.rfq_id = r.id
ORDER BY q.submitted_at DESC NULLS LAST, q.id DESC;
`;

export const SELECT_QUOTATIONS_BY_VENDOR_QUERY = `
SELECT q.id, q.quotation_number, q.rfq_id, q.vendor_id, q.total_amount, q.delivery_days, q.notes, q.status, q.submitted_at,
       v.company_name, v.gst_number,
       r.rfq_number, r.title AS rfq_title
FROM quotations q
JOIN vendors v ON q.vendor_id = v.id
JOIN rfqs r ON q.rfq_id = r.id
WHERE q.vendor_id = $1
ORDER BY q.submitted_at DESC NULLS LAST, q.id DESC;
`;

export const SELECT_QUOTATIONS_BY_RFQ_QUERY = `
SELECT q.id, q.quotation_number, q.rfq_id, q.vendor_id, q.total_amount, q.delivery_days, q.notes, q.status, q.submitted_at,
       v.company_name, v.gst_number,
       r.rfq_number, r.title AS rfq_title
FROM quotations q
JOIN vendors v ON q.vendor_id = v.id
JOIN rfqs r ON q.rfq_id = r.id
WHERE q.rfq_id = $1
ORDER BY q.total_amount ASC, q.submitted_at ASC;
`;

export const SELECT_QUOTATION_BY_RFQ_AND_VENDOR_QUERY = `
SELECT q.id, q.quotation_number, q.rfq_id, q.vendor_id, q.total_amount, q.delivery_days, q.notes, q.status, q.submitted_at,
       v.company_name, v.gst_number
FROM quotations q
JOIN vendors v ON q.vendor_id = v.id
WHERE q.rfq_id = $1 AND q.vendor_id = $2;
`;

export const UPDATE_QUOTATION_QUERY = `
UPDATE quotations
SET total_amount = $1, delivery_days = $2, notes = $3, status = $4, submitted_at = $5
WHERE id = $6
RETURNING id, quotation_number, rfq_id, vendor_id, total_amount, delivery_days, notes, status, submitted_at;
`;

export const DELETE_QUOTATION_ITEMS_QUERY = `
DELETE FROM quotation_items
WHERE quotation_id = $1;
`;

export const SELECT_RFQ_ITEM_QUANTITY_QUERY = `
SELECT ri.id, ri.quantity FROM rfq_items ri
WHERE ri.id = $1 AND ri.rfq_id = $2;
`;

export const DELETE_QUOTATION_QUERY = `
DELETE FROM quotations
WHERE id = $1;
`;
