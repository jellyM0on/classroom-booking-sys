import { auth } from "../configs/firebase.js";
import User from "../models/UserModel.js";
import { sendSetPasswordVerificationEmail } from "../utils/sendVerificationEmail.js";
import { validateUser } from "../validators/userValidator.js";

export const registerUser = async (userData) => {
  // Validate
  await validateUser(userData);

  // Save user in firebase
  const userRecord = await auth.createUser({
    email: userData.email,
    password: userData.password,
  });

  await auth.setCustomUserClaims(userRecord.uid, { role: userData.role });

  // Save user in DB
  const user = await User.create({
    uid: userRecord.uid,
    email: userRecord.email,
    role: userData.role,
    name: userData.name,
    departmentId: userData.departmentId,
  });

  // Send email
  const actionCodeSettings = {
    url: "http://localhost:5173/login",
    handleCodeInApp: true,
  };

  const resetLink = await auth.generatePasswordResetLink(
    userRecord.email,
    actionCodeSettings
  );

  await sendSetPasswordVerificationEmail(userRecord.email, resetLink);

  return user;
};
