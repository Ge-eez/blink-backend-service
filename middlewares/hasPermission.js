const hasPermission = (role) => {
  return async (req, res, next) => {
    try {
      if (req.user.role !== role) {
        return res
          .status(403)
          .json({ message: "Forbidden: Insufficient permissions." });
      }
      next();
    } catch (error) {
      return res.status(500).json({ message: "Internal server error." });
    }
  };
};

module.exports = hasPermission;
