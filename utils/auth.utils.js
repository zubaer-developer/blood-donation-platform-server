const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_for_dev";

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

// password compare
const comparePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

const createToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
};

module.exports = {
  hashPassword,
  comparePassword,
  createToken,
};
