export async function up(queryInterface) {
  const buildings = await queryInterface.bulkInsert(
    "buildings",
    [
      {
        code: "BLDG1",
        name: "Main Campus Building",
        address: "123 Main St",
        total_floors: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        code: "BLDG2",
        name: "Science Complex",
        address: "456 Science Blvd",
        total_floors: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    { returning: true }
  );

  const buildingIds = Array.isArray(buildings)
    ? buildings.map((b) => b.id)
    : [1, 2];

  await queryInterface.bulkInsert("rooms", [
    {
      number: "101",
      type: "classroom",
      open_time: "08:00",
      close_time: "17:00",
      buildingId: buildingIds[0],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      number: "102",
      type: "computer_lab",
      open_time: "09:00",
      close_time: "18:00",
      buildingId: buildingIds[0],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      number: "201",
      type: "science_lab",
      open_time: "08:30",
      close_time: "16:30",
      buildingId: buildingIds[1],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      number: "202",
      type: "specialty",
      open_time: "10:00",
      close_time: "19:00",
      buildingId: buildingIds[1],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
}

export async function down(queryInterface) {
  await queryInterface.bulkDelete("rooms", null, {});
  await queryInterface.bulkDelete("buildings", null, {});
}
