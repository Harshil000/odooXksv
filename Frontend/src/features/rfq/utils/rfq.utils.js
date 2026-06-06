/**
 * Formats an ISO date string into a user-friendly readable date
 * @param {string} dateString 
 * @returns {string}
 */
export function formatDate(dateString) {
  if (!dateString) return "";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateString;
  }
}

/**
 * Returns formatted status label
 * @param {string} status 
 * @returns {string}
 */
export function formatRfqStatus(status) {
  if (!status) return "Draft";
  return status.toUpperCase();
}

/**
 * Validates RFQ form inputs
 * @param {object} param0
 * @returns {string|null} validation error message or null if valid
 */
export function validateRfqData({ title, deadline, items }) {
  if (!title || !title.trim()) {
    return "RFQ Title is required";
  }
  if (!deadline) {
    return "RFQ Deadline is required";
  }
  if (!items || items.length === 0) {
    return "At least one product item is required";
  }
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (!item.product_name || !item.product_name.trim()) {
      return `Product name is required for item #${i + 1}`;
    }
    if (!item.quantity || isNaN(item.quantity) || Number(item.quantity) <= 0) {
      return `Quantity must be greater than 0 for item #${i + 1}`;
    }
  }
  return null;
}

