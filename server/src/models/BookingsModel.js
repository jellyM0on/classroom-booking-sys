import { DataTypes } from "sequelize";
import { sequelize } from "../configs/sequelize.js";

const Booking = sequelize.define(
  "Booking",
  {
    status: {
      type: DataTypes.ENUM(
        "draft",
        "pending",
        "approved",
        "rejected",
        "cancelled"
      ),
      allowNull: false,
      defaultValue: "draft",
      validate: {
        notNull: { msg: "Status is required" },
        isIn: {
          args: [["draft", "pending", "approved", "rejected", "cancelled"]],
          msg: "Invalid status value",
        },
      },
    },
    reviewed_at: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isDate: { msg: "Reviewed at must be a valid date" },
      },
    },
    number_of_occupants: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: "Number of occupants is required" },
        isInt: { msg: "Number of occupants must be an integer" },
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
        notNull: { msg: "Purpose is required" },
        notEmpty: { msg: "Purpose cannot be empty" },
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
        notNull: { msg: "Urgency is required" },
        isIn: {
          args: [["low", "medium", "high", "critical"]],
          msg: "Invalid urgency value",
        },
      },
    },
    schedule_type: {
      type: DataTypes.ENUM("once", "repeating"),
      allowNull: false,
      defaultValue: "once",
      validate: {
        notNull: { msg: "Schedule type is required" },
        isIn: {
          args: [["once", "repeating"]],
          msg: "Invalid schedule type value",
        },
      },
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isDate: { msg: "Start date must be a valid date" },
      },
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isDate: { msg: "End date must be a valid date" },
      },
    },
    interval_type: {
      type: DataTypes.ENUM("daily", "weekly", "biweekly"),
      allowNull: true,
      validate: {
        isIn: {
          args: [["daily", "weekly", "biweekly"]],
          msg: "Invalid interval type",
        },
      },
    },
    repeating_days: {
      type: DataTypes.JSON,
      allowNull: true,
      validate: {
        isValidDays(value) {
          if (value && !Array.isArray(value)) {
            throw new Error("Repeating days must be an array");
          }
          const allowed = ["S", "M", "T", "W", "TH", "F"];
          for (const day of value || []) {
            if (!allowed.includes(day)) {
              throw new Error(`Invalid day in repeating_days: ${day}`);
            }
          }
        },
      },
    },
  },
  {
    timestamps: true,
    tableName: "bookings",
    validate: {
      scheduleConsistency() {
        if (this.schedule_type === "repeating") {
          if (!this.start_date)
            throw new Error("start_date is required for repeating schedules");
          if (!this.end_date)
            throw new Error("end_date is required for repeating schedules");
          if (!this.interval_type)
            throw new Error(
              "interval_type is required for repeating schedules"
            );
        } else if (this.schedule_type === "once") {
          if (this.start_date || this.end_date || this.interval_type) {
            throw new Error(
              "start_date, end_date, and interval_type must be null for once schedules"
            );
          }
        }
      },
    },
  }
);

export default Booking;
