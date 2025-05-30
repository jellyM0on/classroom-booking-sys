import { registerUser } from "../services/authService.js";
import { formatError } from "../utils/formatError.js";

export const register = async (req, res) => {
  try {
    const user = req.body;

    await registerUser(user);

    return res.status(200).json({ message: "User registered" });
  } catch (error) {
    console.log(error);
    const formattedError = formatError(error);

    return res.status(500).json(formattedError);
  }
};
