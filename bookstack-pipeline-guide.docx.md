# **Excel to BookStack Wiki Pipeline**

## **Complete Step-by-Step Guide**

This guide walks you through the entire process of turning your 505-article Excel catalog into a fully populated BookStack wiki. The pipeline has 6 phases:

| Phase | Description | Tool | Time |
| :---- | :---- | :---- | :---- |
| 1 | Deploy BookStack and configure theming | Docker | 1-2 days |
| 2 | Create BookStack hierarchy (shelves, books, chapters) from Excel | Python script | 30 minutes |
| 3 | Generate article content using AI (Claude) | Claude Project | 2-4 weeks |
| 4 | Review and verify accuracy of generated content | Manual \+ search | Ongoing |
| 5 | Bulk upload articles to BookStack via API | Python script | 1-2 hours |
| 6 | Ongoing maintenance, updates, and gap-filling | BookStack UI | Ongoing |

# **Phase 1: Deploy BookStack**

Set up BookStack on your Proxmox VM using Docker Compose. This gets the wiki running before any content creation begins.

## **Step 1.1: Create Docker Compose File**

SSH into your Proxmox VM and create the BookStack project directory:

mkdir \-p /opt/bookstack && cd /opt/bookstack  
nano docker-compose.yml

Paste the following docker-compose.yml:

version: '3'  
services:  
  bookstack:  
    image: lscr.io/linuxserver/bookstack:latest  
    container\_name: bookstack  
    environment:  
      \- PUID=1000  
      \- PGID=1000  
      \- TZ=America/Chicago  
      \- APP\_URL=https://wiki.kecktech.com  
      \- DB\_HOST=bookstack-db  
      \- DB\_PORT=3306  
      \- DB\_DATABASE=bookstack  
      \- DB\_USER=bookstack  
      \- DB\_PASS=${BOOKSTACK\_DB\_PASS}  
    volumes:  
      \- ./config:/config  
    ports:  
      \- '6875:80'  
    depends\_on:  
      \- bookstack-db  
    restart: unless-stopped

  bookstack-db:  
    image: mariadb:10  
    container\_name: bookstack-db  
    environment:  
      \- MYSQL\_ROOT\_PASSWORD=${MYSQL\_ROOT\_PASS}  
      \- MYSQL\_DATABASE=bookstack  
      \- MYSQL\_USER=bookstack  
      \- MYSQL\_PASSWORD=${BOOKSTACK\_DB\_PASS}  
    volumes:  
      \- dbdata:/var/lib/mysql  
    restart: unless-stopped

volumes:  
  dbdata:

## **Step 1.2: Create Environment File**

nano .env

BOOKSTACK\_DB\_PASS=your\_secure\_password\_here  
MYSQL\_ROOT\_PASS=your\_root\_password\_here

## **Step 1.3: Start BookStack**

docker compose up \-d

\# Wait 30 seconds for startup, then verify:  
docker compose logs bookstack | tail \-20

\# Default login: admin@admin.com / password  
\# CHANGE THIS IMMEDIATELY after first login

## **Step 1.4: Configure Cloudflare Tunnel**

Add a new public hostname in your Cloudflare tunnel dashboard:

* Subdomain: wiki

* Domain: kecktech.com

* Service: HTTP://localhost:6875

## **Step 1.5: Generate API Token**

You need an API token for all automated operations. In BookStack:

1. Log in as admin

2. Go to your profile (top right → Edit Profile)

3. Scroll down to “API Tokens” section

4. Click “Create Token”

5. Give it a name like “bulk-import”

6. Copy both the Token ID and Token Secret — you won’t see the secret again

7. Save these in a .env file on your workstation:

\# \~/bookstack-import/.env  
BOOKSTACK\_URL=https://wiki.kecktech.com  
BOOKSTACK\_TOKEN\_ID=your\_token\_id  
BOOKSTACK\_TOKEN\_SECRET=your\_token\_secret

# **Phase 2: Create BookStack Hierarchy from Excel**

This phase reads your Excel catalog and creates the full Shelf → Book → Chapter structure in BookStack via its REST API, so articles have a home before content is written.

## **Step 2.1: Set Up the Import Project**

mkdir \~/bookstack-import && cd \~/bookstack-import  
npm init \-y  
npm install xlsx dotenv node-fetch@2

\# Copy your Excel catalog here:  
cp /path/to/kecktech-wiki-article-catalog.xlsx ./catalog.xlsx

## **Step 2.2: Create the Hierarchy Builder Script**

Create a file called create-hierarchy.js. This script reads the Excel file, extracts unique categories and subcategories, and creates the corresponding BookStack shelves, books, and chapters:

// create-hierarchy.js  
require('dotenv').config();  
const XLSX \= require('xlsx');  
const fetch \= require('node-fetch');

const BASE \= process.env.BOOKSTACK\_URL \+ '/api';  
const AUTH \= {  
  'Authorization': \`Token ${process.env.BOOKSTACK\_TOKEN\_ID}:${process.env.BOOKSTACK\_TOKEN\_SECRET}\`,  
  'Content-Type': 'application/json'  
};

async function api(method, endpoint, body) {  
  const opts \= { method, headers: AUTH };  
  if (body) opts.body \= JSON.stringify(body);  
  const res \= await fetch(\`${BASE}${endpoint}\`, opts);  
  if (\!res.ok) {  
    const err \= await res.text();  
    throw new Error(\`API ${method} ${endpoint}: ${res.status} \- ${err}\`);  
  }  
  return res.json();  
}

async function main() {  
  // 1\. Read Excel  
  const wb \= XLSX.readFile('./catalog.xlsx');  
  const ws \= wb.Sheets\['Article Catalog'\];  
  const rows \= XLSX.utils.sheet\_to\_json(ws);  
  console.log(\`Read ${rows.length} articles from catalog\`);

  // 2\. Build hierarchy map: Category \-\> Subcategories  
  const hierarchy \= {};  
  for (const row of rows) {  
    const cat \= row\['Category'\];  
    const sub \= row\['Subcategory'\];  
    if (\!hierarchy\[cat\]) hierarchy\[cat\] \= new Set();  
    hierarchy\[cat\].add(sub);  
  }

  // 3\. Create structure in BookStack  
  const mapping \= {}; // chapter name \-\> chapter ID (for article upload)

  for (const \[shelfName, subcats\] of Object.entries(hierarchy)) {  
    // Create Shelf  
    console.log(\`Creating shelf: ${shelfName}\`);  
    const shelf \= await api('POST', '/shelves', {  
      name: shelfName,  
      description: \`Knowledge base articles for ${shelfName}\`  
    });

    // Create Book (one per shelf for simplicity)  
    const book \= await api('POST', '/books', {  
      name: \`${shelfName} Articles\`,  
      description: \`All ${shelfName} support articles\`  
    });

    // Assign book to shelf  
    await api('PUT', \`/shelves/${shelf.id}\`, {  
      books: \[book.id\]  
    });

    // Create Chapters (one per subcategory)  
    for (const subcat of subcats) {  
      console.log(\`  Creating chapter: ${subcat}\`);  
      const chapter \= await api('POST', '/chapters', {  
        book\_id: book.id,  
        name: subcat,  
        description: \`${subcat} articles\`  
      });  
      mapping\[\`${shelfName}||${subcat}\`\] \= chapter.id;  
    }  
  }

  // 4\. Save mapping for Phase 5 upload  
  const fs \= require('fs');  
  fs.writeFileSync('./chapter-mapping.json',  
    JSON.stringify(mapping, null, 2));  
  console.log('\\nHierarchy created\! Mapping saved to chapter-mapping.json');  
  console.log(\`Created ${Object.keys(hierarchy).length} shelves\`);  
  console.log(\`Created ${Object.keys(mapping).length} chapters\`);  
}

main().catch(console.error);

## **Step 2.3: Run the Hierarchy Builder**

node create-hierarchy.js

\# Expected output:  
\# Read 505 articles from catalog  
\# Creating shelf: Windows PC  
\#   Creating chapter: Startup & Boot Issues  
\#   Creating chapter: Performance & Speed  
\#   ...  
\# Hierarchy created\! Mapping saved to chapter-mapping.json  
\# Created 10 shelves  
\# Created \~45 chapters

After this step, your BookStack will have the complete structure visible in the sidebar, but all chapters will be empty — ready for content.

# **Phase 3: Generate Article Content Using Claude**

This is where the actual articles get written. You’ll use Claude (via a Project in claude.ai or Cursor) with a structured prompt to generate articles in batches, following the sprint schedule from the Excel “Creation Pipeline” sheet.

## **Step 3.1: Set Up a Claude Project for Article Generation**

In claude.ai, create a new Project called “Kecktech Wiki Content”. Add the following as your Project Instructions (custom instructions):

**\--- BEGIN PROJECT INSTRUCTIONS \---**

You are a technical writer for Kecktech IT Solutions, a small  
business and senior citizen technology support company in Park  
City, Kansas. You write knowledge base articles for our wiki.

AUDIENCES:  
\- 'Client' articles: Written for non-technical users and seniors.  
  Use 6th-8th grade reading level. Short paragraphs (2-3 sentences).  
  No jargon without explanation. Use encouraging, patient tone.  
  Include visual descriptions ('Look for the gear icon').

\- 'Staff' articles: Written for Kecktech support technicians.  
  Can use technical terminology. Include exact paths, registry  
  keys, command-line instructions. Focus on efficiency.

\- 'Both' articles: Start with a client-friendly overview, then  
  include a 'Technical Details' section for staff reference.

ARTICLE FORMAT (follow exactly):

\# \[Article Title\]

\*\*Difficulty:\*\* Easy/Medium/Hard  
\*\*Audience:\*\* Client/Staff/Both  
\*\*Last Verified:\*\* \[current month and year\]  
\*\*Applies To:\*\* \[specific OS versions, devices\]

\#\# Overview  
\[2-3 sentence plain-English summary of what this article covers  
and when someone would need it\]

\#\# Steps / Instructions  
\[Numbered steps with clear action verbs: Click, Tap, Open, Type\]  
\[Each step should be ONE action\]  
\[Include what the user should SEE after each step for confirmation\]

\#\# Troubleshooting  
\[If the steps above didn't work, what to try next\]  
\[Common variations of the problem\]

\#\# When to Contact Kecktech  
\[Clear criteria for when self-service ends and they should call us\]  
\[Include: 'Call us at \[PHONE\] or email support@kecktech.com'\]

\#\# Related Articles  
\[Suggest 2-3 related article titles from the catalog\]

\---

RULES:  
\- Always specify which OS version (Windows 11 24H2, iOS 18,  
  Android 15\) the instructions apply to  
\- Never make up menu paths — if unsure, say 'path may vary'  
\- For security articles, always recommend Kecktech's services  
\- Include a 'When to Contact Kecktech' section in every article  
\- Keep articles under the specified word count  
\- Use Markdown formatting (BookStack supports it natively)  
\- For senior-focused articles, be extra patient and encouraging

**\--- END PROJECT INSTRUCTIONS \---**

## **Step 3.2: Generate Articles in Batches**

Follow the sprint schedule from the Excel “Creation Pipeline” sheet. For each sprint, paste a batch request into the Claude Project chat. Example:

Please write the following 5 wiki articles. For each one, use the  
format from the project instructions. Output each article  
separated by '---ARTICLE BREAK---' so I can split them apart.

1\. KB-0001: Computer Won't Turn On — Step-by-Step Checklist  
   Audience: Client | Difficulty: Easy | \~600 words  
   Tags: power, startup, troubleshooting

2\. KB-0002: What to Do When You See a Black Screen on Startup  
   Audience: Client | Difficulty: Easy | \~500 words  
   Tags: black screen, boot, display

3\. KB-0003: Blue Screen of Death — What It Means and What to Do  
   Audience: Both | Difficulty: Medium | \~800 words  
   Tags: BSOD, crash, error

4\. KB-0004: How to Boot Into Safe Mode on Windows 10 and 11  
   Audience: Staff | Difficulty: Medium | \~600 words  
   Tags: safe mode, boot, troubleshooting

5\. KB-0005: Fixing 'Preparing Automatic Repair' Loop  
   Audience: Staff | Difficulty: Medium | \~700 words  
   Tags: repair loop, boot, recovery

Do 5-10 articles per chat message. Claude will generate all of them in the specified format. Copy each article into a separate Markdown file:

\# Save each article as a .md file  
mkdir \-p \~/bookstack-import/articles

\# File naming convention:  
\# KB-0001\_computer-wont-turn-on.md  
\# KB-0002\_black-screen-on-startup.md  
\# KB-0003\_blue-screen-of-death.md

## **Step 3.3: Batch Generation Tips**

* Generate 5-10 articles per Claude message for best quality

* Do one subcategory at a time (all “Startup & Boot” articles together) for consistency

* Review each batch before moving to the next sprint

* If Claude gets a menu path or setting wrong, correct it and ask for a revision

* Save the raw Markdown files — you’ll upload them in Phase 5

* For senior-focused articles, ask Claude to read the article back as if explaining to a 75-year-old

## **Step 3.4: Automation Option (Advanced)**

If you want to fully automate generation using the Claude API from your Nexus stack or a script, you can use the Anthropic API to batch-generate articles programmatically. Create a script that reads the Excel, sends each article request to the API, and saves the Markdown output:

// generate-articles.js (uses Anthropic API)  
const Anthropic \= require('@anthropic-ai/sdk');  
const XLSX \= require('xlsx');  
const fs \= require('fs');

const client \= new Anthropic({ apiKey: process.env.ANTHROPIC\_API\_KEY });

async function generateArticle(article) {  
  const msg \= await client.messages.create({  
    model: 'claude-sonnet-4-20250514',  
    max\_tokens: 2000,  
    system: \`\[paste your project instructions here\]\`,  
    messages: \[{  
      role: 'user',  
      content: \`Write article ${article.ID}: ${article.Title}\\n\` \+  
        \`Audience: ${article.Audience} | \` \+  
        \`Difficulty: ${article.Difficulty} | \` \+  
        \`\~${article.Words} words\\nTags: ${article.Tags}\`  
    }\]  
  });  
  return msg.content\[0\].text;  
}

// Read catalog, generate in batches with rate limiting  
// Save each to \~/bookstack-import/articles/KB-XXXX\_slug.md

This approach can process the entire 505-article catalog in a few hours with proper rate limiting. However, the manual approach in Step 3.2 gives you better quality control.

# **Phase 4: Review and Verify Accuracy**

Every article must be checked for factual accuracy before publishing. This is the most important step — inaccurate support articles damage client trust.

## **Step 4.1: Verification Checklist**

For each article, verify the following:

| Check | How to Verify |
| :---- | :---- |
| Menu paths are correct | Open the actual OS/app and walk through every step. Screenshot if possible. |
| OS version is specified | Article says 'Windows 11' not just 'Windows'. Check if steps work on both Win 10 and 11\. |
| Settings locations accurate | Settings menus change with OS updates. Verify on a current device or check manufacturer docs. |
| Security advice is sound | Cross-reference with CISA.gov, Microsoft Security, or Google Safety Center. |
| Links/references are valid | Any referenced tools, websites, or apps should actually exist and be current. |
| Tone matches audience | Client articles: read aloud. Would a non-technical senior understand every sentence? |
| Kecktech CTA present | Every article ends with a 'When to Contact Kecktech' section. |

## **Step 4.2: Verification Sources by Category**

* Windows PC: Microsoft Learn (learn.microsoft.com/windows) and Microsoft Support

* iPhone/iPad: Apple Support (support.apple.com)

* Android: Google Support (support.google.com) and manufacturer sites (Samsung, etc.)

* Smart Home: Manufacturer documentation (Ring, Nest, Alexa, etc.)

* Security: CISA.gov, StaySafeOnline.org, FTC consumer advice

* Business: Microsoft 365 Admin docs, Google Workspace Admin Help

## **Step 4.3: Review Workflow**

1. Generate a batch of 5-10 articles (Phase 3\)

2. Self-review: Walk through every step on an actual device

3. Mark the article status in the Excel as “Reviewed”

4. Fix any inaccuracies in the Markdown file

5. Mark as “Ready to Upload”

6. Upload to BookStack (Phase 5\)

Update the “Status” column in the Excel catalog as articles move through the pipeline: Not Started → Drafted → Reviewed → Ready to Upload → Published.

# **Phase 5: Bulk Upload Articles to BookStack**

Once articles are reviewed and approved, upload them to BookStack using the REST API and the chapter mapping from Phase 2\.

## **Step 5.1: Create the Upload Script**

// upload-articles.js  
require('dotenv').config();  
const fs \= require('fs');  
const path \= require('path');  
const fetch \= require('node-fetch');  
const XLSX \= require('xlsx');

const BASE \= process.env.BOOKSTACK\_URL \+ '/api';  
const AUTH \= {  
  'Authorization': \`Token ${process.env.BOOKSTACK\_TOKEN\_ID}:${process.env.BOOKSTACK\_TOKEN\_SECRET}\`,  
  'Content-Type': 'application/json'  
};

async function api(method, endpoint, body) {  
  const opts \= { method, headers: AUTH };  
  if (body) opts.body \= JSON.stringify(body);  
  const res \= await fetch(\`${BASE}${endpoint}\`, opts);  
  if (\!res.ok) throw new Error(\`${res.status}: ${await res.text()}\`);  
  return res.json();  
}

async function main() {  
  // Load chapter mapping from Phase 2  
  const mapping \= JSON.parse(  
    fs.readFileSync('./chapter-mapping.json', 'utf8'));

  // Load Excel catalog for metadata  
  const wb \= XLSX.readFile('./catalog.xlsx');  
  const rows \= XLSX.utils.sheet\_to\_json(wb.Sheets\['Article Catalog'\]);

  // Get list of article files  
  const articlesDir \= './articles';  
  const files \= fs.readdirSync(articlesDir)  
    .filter(f \=\> f.endsWith('.md'))  
    .sort();

  console.log(\`Found ${files.length} articles to upload\`);  
  let uploaded \= 0, skipped \= 0, errors \= 0;

  for (const file of files) {  
    try {  
      // Extract KB ID from filename: KB-0001\_title.md  
      const kbId \= file.split('\_')\[0\]; // 'KB-0001'

      // Find matching row in catalog  
      const meta \= rows.find(r \=\> r.ID \=== kbId);  
      if (\!meta) { console.log(\`  SKIP ${file}: no catalog entry\`);  
        skipped++; continue; }

      // Find chapter ID  
      const key \= \`${meta.Category}||${meta.Subcategory}\`;  
      const chapterId \= mapping\[key\];  
      if (\!chapterId) { console.log(\`  SKIP ${file}: no chapter\`);  
        skipped++; continue; }

      // Read article content  
      const content \= fs.readFileSync(  
        path.join(articlesDir, file), 'utf8');

      // Create page in BookStack  
      const page \= await api('POST', '/pages', {  
        chapter\_id: chapterId,  
        name: meta\['Article Title'\],  
        markdown: content,  
        tags: (meta.Tags || '').split(',').map(t \=\> ({  
          name: t.trim(), value: ''  
        }))  
      });

      console.log(\`  OK ${kbId}: ${meta\['Article Title'\]}\`);  
      uploaded++;

      // Rate limit: 100ms between requests  
      await new Promise(r \=\> setTimeout(r, 100));

    } catch (err) {  
      console.error(\`  ERR ${file}: ${err.message}\`);  
      errors++;  
    }  
  }

  console.log(\`\\nDone\! Uploaded: ${uploaded},\`,  
    \`Skipped: ${skipped}, Errors: ${errors}\`);  
}

main().catch(console.error);

## **Step 5.2: Run the Upload**

\# Make sure your .env file has the BookStack credentials  
\# Make sure chapter-mapping.json exists from Phase 2  
\# Make sure articles/ directory has your .md files

node upload-articles.js

\# Expected output:  
\# Found 25 articles to upload  
\#   OK KB-0001: Computer Won't Turn On ...  
\#   OK KB-0002: What to Do When You See ...  
\#   ...  
\# Done\! Uploaded: 25, Skipped: 0, Errors: 0

## **Step 5.3: Verify in BookStack**

After each upload batch:

7. Open BookStack in your browser

8. Navigate to the shelf/book/chapter that was populated

9. Spot-check 3-5 articles for correct formatting and placement

10. Verify tags are applied correctly

11. Test the search — search for a keyword from an uploaded article

12. Update the Excel status column to “Published” for uploaded articles

# **Phase 6: Ongoing Maintenance**

## **Monthly Review Cycle**

13. Check for OS/software updates that invalidate article steps (e.g., Windows Update changes a settings menu)

14. Review the “Last Verified” date on articles — re-verify anything older than 6 months

15. Monitor Kecktech support tickets for new common issues not covered in the wiki

16. Add new articles as gaps are identified (update the Excel catalog first, then generate and upload)

## **Quarterly Updates**

* Major OS releases (Windows updates, iOS updates): Audit all articles in that category

* New device categories: Add shelf/book/chapter structure, then populate

* Client feedback: If clients report confusing articles, rewrite at a simpler level

* Analytics: BookStack tracks page views — identify high-traffic articles that need extra polish

## **Article Update Process**

17. Edit the article directly in BookStack’s WYSIWYG or Markdown editor

18. Update the “Last Verified” date in the article header

19. BookStack automatically creates a revision history — no need for external versioning

20. For major rewrites, update the status in the Excel catalog and note the change

## **Version Tagging**

Add version-specific tags to articles so you can quickly find what needs updating when an OS ships a major release:

* windows-11-24h2, ios-18, android-15, macos-sequoia

* When a new version ships, search BookStack by the old version tag to find articles needing review

# **Quick Reference: BookStack API Endpoints**

| Method | Endpoint | Use |
| :---- | :---- | :---- |
| POST | /api/shelves | Create a shelf (top-level category) |
| POST | /api/books | Create a book (inside a shelf) |
| PUT | /api/shelves/{id} | Assign books to a shelf |
| POST | /api/chapters | Create a chapter (inside a book) |
| POST | /api/pages | Create a page (the article itself) |
| PUT | /api/pages/{id} | Update an existing page |
| GET | /api/pages/{id} | Read a page (check if exists) |
| GET | /api/search?query=... | Search across all content |
| POST | /api/attachments | Upload file attachment to a page |
| POST | /api/image-gallery | Upload image to gallery |

## **File Naming Convention**

\# Article markdown files:  
KB-0001\_computer-wont-turn-on.md  
KB-0002\_black-screen-on-startup.md  
KB-0003\_blue-screen-of-death.md

\# Rule: {KB-ID}\_{slug-from-title}.md  
\# Slug: lowercase, hyphens, no special chars, max 50 chars

## **Project Directory Structure**

\~/bookstack-import/  
  .env                    \# API credentials  
  catalog.xlsx            \# Master article catalog  
  chapter-mapping.json    \# Generated by Phase 2 script  
  create-hierarchy.js     \# Phase 2: builds shelves/books/chapters  
  upload-articles.js      \# Phase 5: uploads articles  
  generate-articles.js    \# Phase 3: optional API generation  
  articles/               \# Generated \+ reviewed .md files  
    KB-0001\_computer-wont-turn-on.md  
    KB-0002\_black-screen-on-startup.md  
    ...

*Kecktech IT Solutions — Park City, Kansas — Self-Hosted | Green IT | Circular Economy*