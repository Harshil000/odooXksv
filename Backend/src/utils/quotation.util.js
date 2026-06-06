/**
 * Generates a unique Quotation Number (e.g. QTN-20260606-4912)
 * @returns {string}
 */
export function generateQuotationNumber() {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randPart = Math.floor(1000 + Math.random() * 9000);
  return `QTN-${datePart}-${randPart}`;
}
