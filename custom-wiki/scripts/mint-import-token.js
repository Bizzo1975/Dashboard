/**
 * Mint a one-time wiki import API token (prints plaintext once).
 * Usage inside custom-wiki container:
 *   node /tmp/mint-import-token.js
 */
const crypto = require("crypto");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const token = `help-import-${crypto.randomBytes(16).toString("hex")}`;
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  let user = await prisma.user.findFirst({ where: { deletedAt: null } });
  if (!user) {
    user = await prisma.user.create({
      data: { email: "import@kecktech.net", name: "Help Import" },
    });
  }
  await prisma.apiToken.create({
    data: {
      name: `help-content-import-${Date.now()}`,
      tokenHash,
      userId: user.id,
    },
  });
  console.log(token);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
