import { PrismaClient } from "@prisma/client";

const database = new PrismaClient();

async function main() {
  try {
    await database.category.createMany({
      data: [
        { name: "Computer Science" },
        { name: "Music" },
        { name: "Fitness" },
        { name: "Photography" },
        { name: "Geography" },
        { name: "Accounting" },
        { name: "Enginnering" },
        { name: "Filming" },
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
