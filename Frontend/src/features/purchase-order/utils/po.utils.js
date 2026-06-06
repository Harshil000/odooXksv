export const formatAmount = (amount) => {
  return `₹ ${Number(amount || 0).toLocaleString("en-IN")}`;
};
