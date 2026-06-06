/**
 * Generates a unique Purchase Order Number (e.g. PO-20260606-4921)
 * @returns {string}
 */
export function generatePoNumber() {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randPart = Math.floor(1000 + Math.random() * 9000);
  return `PO-${datePart}-${randPart}`;
}

/**
 * Generates a unique Invoice Number (e.g. INV-20260606-8921)
 * @returns {string}
 */
export function generateInvoiceNumber() {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randPart = Math.floor(1000 + Math.random() * 9000);
  return `INV-${datePart}-${randPart}`;
}
