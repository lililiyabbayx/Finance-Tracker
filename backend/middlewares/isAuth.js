const jwt = require("jsonwebtoken");

const isAuth = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded.id;
      req.userRole = decoded.role;
      console.log("User authenticated with ID:", req.user);
      next();
    } catch (error) {
      console.error("Error verifying token:", error);
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = isAuth;
