import { DataTypes } from "sequelize";
import { sequelize } from "../configs/sequelize.js";

const Building = sequelize.define(
  "Building",
  {
    code: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true,
      validate: {
        notNull: {
          msg: "Code is required",
        },
        len: {
          args: [1, 10],
          msg: "Code must be between 1 and 10 characters long",
        },
      },
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        notNull: {
          msg: "Name is required",
        },
        len: {
          args: [1, 200],
          msg: "Name must be between 1 and 200 characters long",
        },
      },
    },
    address: {
      type: DataTypes.STRING(500),
      allowNull: false,
      validate: {
        notNull: {
          msg: "Address is required",
        },
        len: {
          args: [1, 500],
          msg: "Address must be between 1 and 500 characters long",
        },
      },
    },
    total_floors: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Total floors is required",
        },
        isInt: {
          msg: "Total floors must be an integer",
        },
      },
    },
  },
  {
    timestamps: true,
    tableName: "buildings",
  }
);

export default Building;
