// ==========================================
// MANAGERS / PROCUREMENT / ADMIN AGGREGATES
// ==========================================

export const SELECT_ACTIVE_RFQS_COUNT_GLOBAL = `
SELECT COUNT(*)::int AS count FROM rfqs 
WHERE deadline > CURRENT_TIMESTAMP AND status = 'OPEN';
`;

export const SELECT_PENDING_APPROVALS_COUNT_GLOBAL = `
SELECT COUNT(*)::int AS count FROM quotations 
WHERE status IN ('SUBMITTED', 'UNDER_NEGOTIATION');
`;

export const SELECT_PO_SUM_THIS_MONTH_GLOBAL = `
SELECT COALESCE(SUM(q.total_amount), 0)::numeric AS sum 
FROM purchase_orders po 
JOIN quotations q ON po.quotation_id = q.id 
WHERE po.created_at >= DATE_TRUNC('month', CURRENT_DATE);
`;

export const SELECT_OVERDUE_INVOICES_COUNT_GLOBAL = `
SELECT COUNT(*)::int AS count FROM invoices 
WHERE status != 'PAID';
`;

export const SELECT_RECENT_POS_GLOBAL = `
SELECT po.id, po.po_number, po.issue_date, po.status, q.total_amount, v.company_name 
FROM purchase_orders po 
JOIN quotations q ON po.quotation_id = q.id 
JOIN vendors v ON q.vendor_id = v.id 
ORDER BY po.created_at DESC 
LIMIT 5;
`;

// ==========================================
// VENDOR SPECIFIC AGGREGATES
// ==========================================

export const SELECT_ACTIVE_RFQS_COUNT_VENDOR = `
SELECT COUNT(*)::int AS count 
FROM rfqs r 
JOIN rfq_vendors rv ON r.id = rv.rfq_id 
WHERE r.deadline > CURRENT_TIMESTAMP AND r.status = 'OPEN' AND rv.vendor_id = $1;
`;

export const SELECT_PENDING_APPROVALS_COUNT_VENDOR = `
SELECT COUNT(*)::int AS count 
FROM quotations 
WHERE status IN ('SUBMITTED', 'UNDER_NEGOTIATION') AND vendor_id = $1;
`;

export const SELECT_PO_SUM_THIS_MONTH_VENDOR = `
SELECT COALESCE(SUM(q.total_amount), 0)::numeric AS sum 
FROM purchase_orders po 
JOIN quotations q ON po.quotation_id = q.id 
WHERE po.created_at >= DATE_TRUNC('month', CURRENT_DATE) AND q.vendor_id = $1;
`;

export const SELECT_OVERDUE_INVOICES_COUNT_VENDOR = `
SELECT COUNT(*)::int AS count 
FROM invoices inv 
JOIN purchase_orders po ON inv.purchase_order_id = po.id 
JOIN quotations q ON po.quotation_id = q.id 
WHERE inv.status != 'PAID' AND q.vendor_id = $1;
`;

export const SELECT_RECENT_POS_VENDOR = `
SELECT po.id, po.po_number, po.issue_date, po.status, q.total_amount, v.company_name 
FROM purchase_orders po 
JOIN quotations q ON po.quotation_id = q.id 
JOIN vendors v ON q.vendor_id = v.id 
WHERE q.vendor_id = $1 
ORDER BY po.created_at DESC 
LIMIT 5;
`;
