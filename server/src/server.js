import dotenv from "dotenv";
import app from "./app.js";
import { connectDb } from "./configs/database.js";

dotenv.config();
const PORT = process.env.PORT;

connectDb();

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
