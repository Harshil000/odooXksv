import jwt from "jsonwebtoken";

export function issueAccessToken(payload) {
  const secret = process.env.JWT_ACCESS_SECRET || "default_jwt_secret_key_12345";
  return jwt.sign(payload, secret, {
    expiresIn: "7d",
  });
}
