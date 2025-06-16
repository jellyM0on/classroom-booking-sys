import Building from "./BuildingsModel.js";
import Department from "./DepartmentModel.js";
import Room from "./RoomsModel.js";
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

Building.hasMany(Room, {
  foreignKey: {
    name: "buildingId",
    allowNull: false,
  },
  as: "rooms",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Room.belongsTo(Building, {
  foreignKey: {
    name: "buildingId",
    allowNull: false,
  },
  as: "building",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

export { Building, Department, Room, User };
