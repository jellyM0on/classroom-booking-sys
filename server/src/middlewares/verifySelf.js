import User from "../models/UserModel.js";

const verifySelf = async (req, res, next) => {
  try {
    const requestingUid = req.user?.uid;
    const userId = req.params.id;

    if (!requestingUid) {
      return res.status(401).json({ message: "Unauthorized. UID not found" });
    }

    const user = await User.findOne({ where: { id: userId } });

    if (user.uid !== requestingUid || !user) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export default verifySelf;
