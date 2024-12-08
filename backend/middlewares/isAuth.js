const jwt = require("jsonwebtoken");

const isAuth = async (req, res, next) => {
  const headerObj = req.headers;
  const token = headerObj?.authorization?.split(" ")[1];
  const varifyToken = jwt.verify(
    token,
    process.env.JWT_SECRET,
    (err, decoded) => {
      if (err) {
        return false;
      } else {
        return decoded;
      }
    }
  );
  if (varifyToken) {
    req.user = varifyToken.id;
    next();
  } else {
    const error = new Error("Token expired");
    next(error);
  }
};

module.exports = isAuth;
