const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();
const outPath = path.resolve(__dirname, "../docs/ARTICLE_REVIEW_QUEUE.md");

async function run() {
  const pages = await prisma.page.findMany({
    where: { deletedAt: null },
    orderBy: [{ category: "asc" }, { subcategory: "asc" }, { title: "asc" }],
    select: {
      kbId: true,
      title: true,
      slug: true,
      category: true,
      subcategory: true,
      reviewStatus: true,
      reviewerName: true
    }
  });

  const lines = [
    "# Article Review Queue",
    "",
    `Total pages: ${pages.length}`,
    "",
    "| KB ID | Title | Category | Subcategory | Status | Reviewer | Link |",
    "|---|---|---|---|---|---|---|"
  ];

  for (const page of pages) {
    lines.push(
      `| ${page.kbId || "-"} | ${page.title.replace(/\|/g, "\\|")} | ${page.category || "-"} | ${page.subcategory || "-"} | ${page.reviewStatus} | ${page.reviewerName || "-"} | [/pages/${page.slug}](/pages/${page.slug}) |`
    );
  }

  fs.writeFileSync(outPath, `${lines.join("\n")}\n`, "utf8");
  console.log(`Wrote review queue: ${outPath}`);
}

run()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
