export const INSERT_RFQ_QUERY = `
INSERT INTO rfqs (rfq_number, title, description, deadline, status, created_by)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING id, rfq_number, title, description, deadline, status, created_by, created_at;
`;

export const INSERT_PRODUCT_QUERY = `
INSERT INTO products (product_name, description, unit)
VALUES ($1, $2, $3)
ON CONFLICT (product_name) DO UPDATE 
SET description = COALESCE(EXCLUDED.description, products.description),
    unit = COALESCE(EXCLUDED.unit, products.unit)
RETURNING id, product_name, description, unit, created_at;
`;

export const INSERT_RFQ_ITEM_QUERY = `
INSERT INTO rfq_items (rfq_id, product_id, quantity)
VALUES ($1, $2, $3)
RETURNING id, rfq_id, product_id, quantity;
`;

export const INSERT_RFQ_VENDOR_QUERY = `
INSERT INTO rfq_vendors (rfq_id, vendor_id)
VALUES ($1, $2)
RETURNING rfq_id, vendor_id, sent_at;
`;

export const SELECT_ALL_RFQS_QUERY = `
SELECT r.id, r.rfq_number, r.title, r.description, r.deadline,
       CASE 
         WHEN r.deadline < CURRENT_TIMESTAMP AND r.status = 'OPEN' THEN 'CLOSED'::rfq_status
         ELSE r.status 
       END AS status,
       r.created_by, r.created_at,
       u.full_name AS creator_name, u.email AS creator_email
FROM rfqs r
JOIN users u ON r.created_by = u.id
ORDER BY r.created_at DESC;
`;

export const SELECT_RFQ_BY_ID_QUERY = `
SELECT r.id, r.rfq_number, r.title, r.description, r.deadline,
       CASE 
         WHEN r.deadline < CURRENT_TIMESTAMP AND r.status = 'OPEN' THEN 'CLOSED'::rfq_status
         ELSE r.status 
       END AS status,
       r.created_by, r.created_at,
       u.full_name AS creator_name, u.email AS creator_email
FROM rfqs r
JOIN users u ON r.created_by = u.id
WHERE r.id = $1;
`;

export const SELECT_RFQ_ITEMS_QUERY = `
SELECT ri.id, ri.rfq_id, ri.product_id, ri.quantity, p.product_name, p.description AS product_description, p.unit
FROM rfq_items ri
JOIN products p ON ri.product_id = p.id
WHERE ri.rfq_id = $1;
`;

export const SELECT_RFQ_VENDORS_QUERY = `
SELECT rv.rfq_id, rv.vendor_id, rv.sent_at, v.company_name, v.contact_person, v.phone, v.address, u.email AS vendor_email
FROM rfq_vendors rv
JOIN vendors v ON rv.vendor_id = v.id
JOIN users u ON v.user_id = u.id
WHERE rv.rfq_id = $1;
`;

export const UPDATE_RFQ_QUERY = `
UPDATE rfqs
SET title = $1, description = $2, deadline = $3, status = $4
WHERE id = $5
RETURNING id, rfq_number, title, description, deadline, status, created_by, created_at;
`;

export const DELETE_RFQ_ITEMS_QUERY = `
DELETE FROM rfq_items
WHERE rfq_id = $1;
`;

export const DELETE_RFQ_VENDORS_QUERY = `
DELETE FROM rfq_vendors
WHERE rfq_id = $1;
`;
