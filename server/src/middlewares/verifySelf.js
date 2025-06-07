import User from "../models/UserModel.js";

const verifySelf = async (req, res, next) => {
  try {
    const requestingUid = req.user?.uid;
    const userId = req.params.id;

    if (!requestingUid) {
      return res.status(401).json({ message: "Unauthorized. UID not found" });
    }

    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.uid !== requestingUid) {
      return res.status(403).json({ message: "Forbidden." });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export default verifySelf;
