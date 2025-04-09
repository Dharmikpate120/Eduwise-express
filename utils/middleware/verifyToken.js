const jwt = require("jsonwebtoken");
require("dotenv").config();

const secretKey = process.env.JWT_SECRET_KEY;

function verifyAdminToken(req, res, next) {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Failed to authenticate token" });
    }
    if (!decoded.role === "admin") {
      return res.status(404).json({ error: "you don't have admin access!" });
    }
    req.user = decoded;

    next();
  });
}
function verifyUserToken(req, res, next) {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Failed to authenticate token" });
    }
    if (!decoded.role === "user") {
      return res.status(404).json({ error: "you don't have user access!" });
    }
    req.user = decoded;

    next();
  });
}


function verifyTestToken(req, res, next) {
  const token = req.headers["testtoken"];
  if (!token) {
    return res.status(401).json({ error: "No testToken provided" });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Failed to authenticate token" });
    }
    req.testToken = decoded;

    next();
  });
}

module.exports = { verifyAdminToken, verifyUserToken, verifyTestToken };
