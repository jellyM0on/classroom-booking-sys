import User from "../models/UserModel.js";

// TODO: Remove unnecessary class
export class ValidationError extends Error {
  constructor(errors) {
    super("Validation failed");
    this.name = "ValidationError";
    this.errors = errors;
  }
}

// TODO: Might need to refactor

export const validateUser = async (user) => {
  const errors = [];

  if (user.password.length < 6 || !/[A-Z]/.test(user.password)) {
    errors.push({
      path: "password",
      message:
        "Password must be at least 6 characters long and contain at least one uppercase letter",
    });
  }

  const existingUser = await User.findOne({ where: { email: user.email } });
  if (existingUser) {
    errors.push({
      path: "email",
      message: "Email already exists",
    });
  }

  const tempUser = User.build({
    email: user.email,
    role: user.role,
    uid: "temp_uid",
    departmentId: user.departmentId,
    name: user.name,
  });

  try {
    await tempUser.validate();
  } catch (err) {
    if (err.name === "SequelizeValidationError") {
      for (const e of err.errors) {
        errors.push({ path: e.path, message: e.message });
      }
    } else {
      throw err;
    }
  }

  if (errors.length > 0) {
    const syntheticError = new Error("Validation failed");
    syntheticError.name = "SequelizeValidationError";
    syntheticError.errors = errors;
    throw syntheticError;
  }
};
