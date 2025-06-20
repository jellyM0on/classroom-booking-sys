import { DataTypes } from "sequelize";
import { sequelize } from "../configs/sequelize.js";
import Department from "./DepartmentModel.js";

const User = sequelize.define(
  "User",
  {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    role: {
      type: DataTypes.ENUM("admin", "staff"),
      defaultValue: "staff",
      allowNull: false,
      validate: {
        isIn: {
          args: [["admin", "staff"]],
          msg: "Role must be either 'admin' or 'staff'",
        },
      },
    },
    uid: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    departmentId: {
      type: DataTypes.INTEGER,
      references: {
        model: Department,
        key: "id",
      },
      allowNull: false,
      validate: {
        async isExistingDepartment(value) {
          const department = await Department.findByPk(value);
          if (!department) {
            throw new Error(`Department with ID ${value} does not exist`);
          }
        },
      },
    },
    name: {
      type: DataTypes.STRING(400),
      allowNull: false,
      validate: {
        notNull: {
          msg: "Name is required",
        },
        notEmpty: {
          msg: "Name cannot be empty",
        },
        len: {
          args: [5, 400],
          msg: "Name must be between 5 and 400 characters long",
        },
      },
    },
  },
  {
    timestamps: true,
    tableName: "users",
  }
);

export default User;
