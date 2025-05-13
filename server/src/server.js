import dotenv from "dotenv";
import app from "./app.js";
import { connectDb, sequelize } from "./configs/database.js";

dotenv.config();
const PORT = process.env.PORT;

connectDb();

// TODO: Move this to separate file
(async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log("Database synchronized successfully.");
  } catch (error) {
    console.error("Error syncing database:", error);
  }
})();

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
