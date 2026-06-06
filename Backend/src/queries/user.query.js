export const INSERT_USER_QUERY = `
INSERT INTO users (full_name, email, password_hash, role)
VALUES ($1, $2, $3, $4)
RETURNING id, full_name, email, role, is_active, created_at, updated_at;
`;

export const INSERT_VENDOR_QUERY = `
INSERT INTO vendors (user_id, company_name, gst_number, contact_person, phone, address)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING id, user_id, company_name, gst_number, contact_person, phone, address, rating, status, created_at;
`;

export const SELECT_USER_BY_EMAIL_QUERY = `
SELECT u.id, u.full_name, u.email, u.password_hash, u.role, u.is_active, u.created_at, u.updated_at,
       v.id AS vendor_id, v.company_name, v.gst_number, v.contact_person, v.phone, v.address, v.rating, v.status AS vendor_status
FROM users u
LEFT JOIN vendors v ON v.user_id = u.id
WHERE u.email = $1
LIMIT 1;
`;

export const SELECT_USER_BY_ID_QUERY = `
SELECT u.id, u.full_name, u.email, u.role, u.is_active, u.created_at, u.updated_at,
       v.id AS vendor_id, v.company_name, v.gst_number, v.contact_person, v.phone, v.address, v.rating, v.status AS vendor_status
FROM users u
LEFT JOIN vendors v ON v.user_id = u.id
WHERE u.id = $1
LIMIT 1;
`;