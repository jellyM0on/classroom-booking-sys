import { DataTypes } from "sequelize";
import { sequelize } from "../configs/sequelize.js";

const BookingSchedule = sequelize.define(
  "BookingSchedule",
  {
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Date is required",
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
    status: {
      type: DataTypes.ENUM("active", "inactive", "cancelled"),
      allowNull: false,
      defaultValue: "inactive",
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
