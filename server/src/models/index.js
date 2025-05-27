import Department from "./DepartmentModel.js";
import User from "./UserModel.js";

Department.hasMany(User, {
  foreignKey: "departmentId",
  as: "users",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

User.belongsTo(Department, {
  foreignKey: "departmentId",
  as: "department",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

export { Department, User };
