import { DataTypes } from "sequelize";
import { sequelize } from "../configs/sequelize.js";

const BookingSchedule = sequelize.define(
  "BookingSchedule",
  {
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Start date is required",
        },
      },
    },
    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notNull: {
          msg: "End date is required",
        },
      },
    },
    start_time: {
      type: DataTypes.TIME,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Start time is required",
        },
      },
    },
    end_time: {
      type: DataTypes.TIME,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Start time is required",
        },
      },
    },
    day_of_week: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Day of week is required",
        },
        isInt: {
          msg: "Day of week must be an integer",
        },
        min: {
          args: [0],
          msg: "Day of week must be between 0 and 5",
        },
        max: {
          args: [5],
          msg: "Day of week must be between 0 and 5",
        },
      },
    },
    frequency: {
      type: DataTypes.ENUM("once", "daily", "weekly", "biweekly", "monthly"),
      allowNull: false,
      defaultValue: "once",
      validate: {
        notNull: {
          msg: "Frequency is required",
        },
        isIn: {
          args: [["once", "daily", "weekly", "biweekly", "monthly"]],
          msg: "Invalid frequency value",
        },
      },
    },
    status: {
      type: DataTypes.ENUM("active", "inactive", "cancelled"),
      allowNull: false,
      defaultValue: "active",
      notNull: {
        msg: "Status is required",
      },
      isIn: {
        args: [["active", "inactive", "cancelled"]],
        msg: "Invalid status value",
      },
    },
  },
  {
    timestamps: true,
    tableName: "booking_schedules",
  }
);

export default BookingSchedule;
