const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const pages = await prisma.page.count();
  const books = await prisma.book.count();
  const shelves = await prisma.shelf.count();
  const chapters = await prisma.chapter.count();
  console.log(JSON.stringify({ pages, books, shelves, chapters }));
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
