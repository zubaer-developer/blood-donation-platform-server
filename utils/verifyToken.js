const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res
      .status(401)
      .send({ message: "Access Denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.error("Token verification failed:", err);
      return res.status(403).send({ message: "Invalid or expired token." });
    }

    req.decodedUser = decoded;
    next();
  });
};

module.exports = { verifyToken };
