import { DataTypes } from "sequelize";
import { sequelize } from "../configs/sequelize.js";

const Booking = sequelize.define(
  "Booking",
  {
    status: {
      type: DataTypes.ENUM("pending", "approved", "rejected", "cancelled"),
      allowNull: false,
      defaultValue: "pending",
      validate: {
        notNull: {
          msg: "Status is required",
        },
        isIn: {
          args: [["pending", "approved", "rejected", "cancelled"]],
          msg: "Invalid status value",
        },
      },
    },
    reviewed_at: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isDate: {
          msg: "Reviewed at must be a valid date",
        },
      },
    },
    reviewed_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
    number_of_occupants: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Number of occupants is required",
        },
        isInt: {
          msg: "Number of occupants must be an integer",
        },
        min: {
          args: [1],
          msg: "Number of occupants must be at least 1",
        },
      },
    },
    purpose: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Purpose is required",
        },
        notEmpty: {
          msg: "Purpose cannot be empty",
        },
      },
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    urgency: {
      type: DataTypes.ENUM("low", "medium", "high", "critical"),
      allowNull: false,
      defaultValue: "medium",
      validate: {
        notNull: {
          msg: "Urgency is required",
        },
        isIn: {
          args: [["low", "medium", "high", "critical"]],
          msg: "Invalid urgency value",
        },
      },
    },
  },
  {
    timestamps: true,
    tableName: "bookings",
  }
);

export default Booking;
