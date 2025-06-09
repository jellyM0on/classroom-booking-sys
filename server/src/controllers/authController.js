import { registerUser } from "../services/authService.js";
import { formatErrors } from "../utils/formatErrors.js";

export const register = async (req, res) => {
  try {
    const user = req.body;

    await registerUser(user);

    return res.status(200).json({ message: "User registered" });
  } catch (error) {
    const formattedError = formatErrors(error);

    return res.status(500).json({errors: formattedError});
  }
};
