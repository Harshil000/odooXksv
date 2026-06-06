export const formatAmount = (amount) => {
  return `₹ ${Number(amount || 0).toLocaleString("en-IN")}`;
};

export const calculateTaxes = (subtotal) => {
  const amount = Number(subtotal || 0);
  const cgst = Number((amount * 0.09).toFixed(2));
  const sgst = Number((amount * 0.09).toFixed(2));
  const grandTotal = Number((amount + cgst + sgst).toFixed(2));
  return { cgst, sgst, grandTotal };
};
