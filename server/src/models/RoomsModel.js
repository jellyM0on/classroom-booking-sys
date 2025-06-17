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
        isValidTime(value) {
          const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/;
          if (!timeRegex.test(value)) {
            throw new Error(
              "Open time must be a valid time in HH:MM or HH:MM:SS format"
            );
          }
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
        isValidTime(value) {
          const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/;
          if (!timeRegex.test(value)) {
            throw new Error(
              "Close time must be a valid time in HH:MM or HH:MM:SS format"
            );
          }
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
