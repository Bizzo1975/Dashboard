const crypto = require("crypto");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const token = process.env.CUSTOM_WIKI_API_TOKEN;

if (!token) {
  console.error("Missing CUSTOM_WIKI_API_TOKEN");
  process.exit(1);
}

async function main() {
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const systemUser = await prisma.user.upsert({
    where: { email: "system-import@kecktech.net" },
    update: {
      name: "System Import",
      deletedAt: null,
    },
    create: {
      email: "system-import@kecktech.net",
      name: "System Import",
    },
  });

  await prisma.apiToken.upsert({
    where: { tokenHash },
    update: {
      deletedAt: null,
      expiresAt: null,
    },
    create: {
      userId: systemUser.id,
      name: "Import Token",
      tokenHash,
    },
  });
  console.log("Seeded custom wiki API token hash.");
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
