export function registerValidation(req, res, next) {
  const { name, full_name, email, password, role, company_name } = req.body;
  const errors = [];

  const finalFullName = (full_name || name || "").trim();
  if (!finalFullName) {
    errors.push({ msg: "Name is required" });
  }

  if (!email || !email.trim()) {
    errors.push({ msg: "Email is required" });
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      errors.push({ msg: "Invalid email format" });
    }
  }

  if (!password || password.length < 6) {
    errors.push({ msg: "Password must be at least 6 characters long" });
  }

  const upperRole = (role || "VENDOR").toUpperCase();
  const validRoles = ["ADMIN", "PROCUREMENT_OFFICER", "MANAGER", "VENDOR"];
  if (!validRoles.includes(upperRole)) {
    errors.push({ msg: `Role must be one of: ${validRoles.join(", ")}` });
  }

  if (upperRole === "VENDOR" && (!company_name || !company_name.trim())) {
    errors.push({ msg: "Company name is required for vendor registration" });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      message: "Validation failed",
      errors,
    });
  }

  next();
}

export function loginValidation(req, res, next) {
  const { email, password } = req.body;
  const errors = [];

  if (!email || !email.trim()) {
    errors.push({ msg: "Email is required" });
  }

  if (!password) {
    errors.push({ msg: "Password is required" });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      message: "Validation failed",
      errors,
    });
  }

  next();
}
