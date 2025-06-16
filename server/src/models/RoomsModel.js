import { DataTypes } from "sequelize";
import { sequelize } from "../configs/sequelize.js";

const Room = sequelize.define(
  "Room",
  {
    number: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Room number is required",
        },
      },
    },
    type: {
      type: DataTypes.ENUM(
        "classroom",
        "science_lab",
        "computer_lab",
        "specialty"
      ),
      allowNull: false,
      validate: {
        notNull: {
          msg: "Room type is required",
        },
        isIn: {
          args: [["classroom", "science_lab", "computer_lab", "specialty"]],
          msg: "Invalid room type",
        },
      },
    },
    open_time: {
      type: DataTypes.TIME,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Open time is required",
        },
        isDate: {
          msg: "Open time must be a valid time",
        },
      },
    },
    close_time: {
      type: DataTypes.TIME,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Close time is required",
        },
        isDate: {
          msg: "Close time must be a valid time",
        },
      },
    },
    instructions: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: "rooms",
  }
);

export default Room;
