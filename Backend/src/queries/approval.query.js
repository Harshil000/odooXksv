export const INSERT_APPROVAL_QUERY = `
INSERT INTO approvals (quotation_id, approver_id, approval_level, status, remarks, approved_at)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING id, quotation_id, approver_id, approval_level, status, remarks, approved_at;
`;

export const SELECT_APPROVALS_BY_QUOTATION_QUERY = `
SELECT a.id, a.quotation_id, a.approver_id, a.approval_level, a.status, a.remarks, a.approved_at,
       u.full_name AS approver_name, u.email AS approver_email
FROM approvals a
JOIN users u ON a.approver_id = u.id
WHERE a.quotation_id = $1
ORDER BY a.approved_at DESC, a.id DESC;
`;

export const SELECT_APPROVAL_BY_ID_QUERY = `
SELECT a.id, a.quotation_id, a.approver_id, a.approval_level, a.status, a.remarks, a.approved_at,
       u.full_name AS approver_name, u.email AS approver_email
FROM approvals a
JOIN users u ON a.approver_id = u.id
WHERE a.id = $1;
`;
