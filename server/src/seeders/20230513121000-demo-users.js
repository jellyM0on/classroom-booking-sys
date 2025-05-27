import dotenv from "dotenv";

dotenv.config();

export async function up(queryInterface) {
  const departments = await queryInterface.sequelize.query(
    "SELECT id FROM departments;"
  );
  const departmentId = departments[0][0]?.id || 1;

  await queryInterface.bulkInsert("users", [
    {
      email: `${process.env.TEST_ADMIN_EMAIL}`,
      role: "admin",
      uid: `${process.env.TEST_ADMIN_UID}`,
      departmentId: departmentId,
      name: "Test System Administrator",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
}

export async function down(queryInterface) {
  await queryInterface.bulkDelete("users", null, {});
}
