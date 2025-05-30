export async function up(queryInterface) {
  await queryInterface.bulkInsert("departments", [
    {
      code: "ADMIN",
      name: "Administration Department",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      code: "CCIS",
      name: "College of Computer and Information Sciences",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
}

export async function down(queryInterface) {
  await queryInterface.bulkDelete("departments", null, {});
}
