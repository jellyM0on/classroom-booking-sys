import BookingSchedule from "./BookingSchedulesModel.js";
import Booking from "./BookingsModel.js";
import Building from "./BuildingsModel.js";
import Department from "./DepartmentModel.js";
import Room from "./RoomsModel.js";
import User from "./UserModel.js";

// A Department has many users. A user belongs to a department
Department.hasMany(User, {
  foreignKey: {
    name: "departmentId",
    allowNull: false,
  },
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

User.belongsTo(Department, {
  foreignKey: {
    name: "departmentId",
    allowNull: false,
  },
  as: "department",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// A building has many rooms. A room belong to a building
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

// A booking has booking schedules. A booking schedule belongs to a booking
Booking.hasMany(BookingSchedule, {
  foreignKey: {
    name: "booking_id",
    allowNull: false,
  },
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

BookingSchedule.belongsTo(Booking, {
  foreignKey: {
    name: "booking_id",
    allowNull: false,
  },
  as: "booking",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// A booking schedule belongs to a room
Room.hasMany(BookingSchedule, {
  foreignKey: {
    name: "room_id",
    allowNull: false,
  },
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

BookingSchedule.belongsTo(Room, {
  foreignKey: {
    name: "room_id",
    allowNull: false,
  },
  as: "room",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// A booking references user through submitted_by, facilitated_by, reviewed_by
User.hasMany(Booking, {
  foreignKey: {
    name: "submitted_by",
    allowNull: false,
  },
  as: "submittedBookings",
});

Booking.belongsTo(User, {
  foreignKey: {
    name: "submitted_by",
    allowNull: false,
  },
  as: "submittedBy",
});

User.hasMany(Booking, {
  foreignKey: {
    name: "facilitated_by",
    allowNull: false,
  },
  as: "facilitatedBookings",
});

Booking.belongsTo(User, {
  foreignKey: {
    name: "facilitated_by",
    allowNull: false,
  },
  as: "facilitatedBy",
});

User.hasMany(Booking, {
  foreignKey: "reviewed_by",
  as: "reviewedBookings",
});

Booking.belongsTo(User, {
  foreignKey: "reviewed_by",
  as: "reviewedBy",
});

export { Booking, BookingSchedule, Building, Department, Room, User };
