export const SELECT_ACTIVE_VENDORS_QUERY = `
SELECT v.id, v.company_name, v.gst_number, v.contact_person, v.phone, v.address, v.rating, v.status,
       u.full_name AS user_name, u.email
FROM vendors v
JOIN users u ON v.user_id = u.id
WHERE v.status = 'ACTIVE' AND u.is_active = true
ORDER BY v.company_name ASC;
`;

export const SELECT_ALL_VENDORS_QUERY = `
SELECT v.id, v.company_name, v.gst_number, v.contact_person, v.phone, v.address, v.rating, v.status,
       u.full_name AS user_name, u.email
FROM vendors v
JOIN users u ON v.user_id = u.id
ORDER BY v.company_name ASC;
`;
