const verifyAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Unauthorized. Admins only." });
    }

    next();
  } catch (error) {
    console.error("Error verifying admin:", error);
    res.status(401).json({ error: "Unauthorized" });
  }
};

export default verifyAdmin;
