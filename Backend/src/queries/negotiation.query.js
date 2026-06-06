export const INSERT_NEGOTIATION_QUERY = `
INSERT INTO negotiations (quotation_id, sender_user_id, proposed_amount, message)
VALUES ($1, $2, $3, $4)
RETURNING id, quotation_id, sender_user_id, proposed_amount, message, created_at;
`;

export const SELECT_NEGOTIATIONS_BY_QUOTATION_QUERY = `
SELECT n.id, n.quotation_id, n.sender_user_id, n.proposed_amount, n.message, n.created_at,
       u.full_name AS sender_name, u.email AS sender_email, u.role AS sender_role
FROM negotiations n
JOIN users u ON n.sender_user_id = u.id
WHERE n.quotation_id = $1
ORDER BY n.created_at ASC, n.id ASC;
`;
