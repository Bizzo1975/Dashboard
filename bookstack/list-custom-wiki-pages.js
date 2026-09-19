const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const pages = await prisma.page.findMany({
    select: { title: true, slug: true },
    orderBy: { title: "asc" },
    take: 20,
  });
  console.log(JSON.stringify(pages));
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
