import dotenv from "dotenv";
import { Sequelize } from "sequelize";

dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
  }
);

export const connectDb = async () => {
  try {
    await sequelize.authenticate();
    //  await sequelize.sync({force: true})
    console.log("Connected to db.");
  } catch (error) {
    console.error("Error connecting to db: ", error);
  }
};
