const jwt = require('jsonwebtoken');

const authenticationMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({
      error: "Unauthourized"
    })
  }

  jwt.verify(token, "hithere", (err, decoded) => {
    if (err) {
      return res.status(401).json({
        error: "Unauthourized"
      })
    }
    req.user = decoded;
    next();
  })
}

module.exports = authenticationMiddleware;