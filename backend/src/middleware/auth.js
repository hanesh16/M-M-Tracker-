// Authentication middleware
const authMiddleware = (req, res, next) => {
  // TODO: Implement JWT verification
  next();
};

module.exports = authMiddleware;
