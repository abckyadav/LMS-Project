import { PrismaClient } from "@prisma/client";

const database = new PrismaClient();

async function main() {
  try {
    await database.category.createMany({
      data: [
        { name: "Computer Science" },
        { name: "Computer" },
        { name: "English" },
        { name: "History" },
        { name: "Geography" },
        { name: "Mathematics" },
        { name: "Physics" },
        { name: "Chemistry" },
        { name: "Biology" },
        { name: "Astronomy" },
      ],
    });

    console.log("Categories seeded successfully!");
  } catch (error) {
    console.error("Error seeding categories to database", error);
  } finally {
    await database.$disconnect();
  }
}

main();
