# Custom App 06: Help Desk / Ticket System

## Replaces
Zendesk, Freshdesk, osTicket

## Core Features
- Ticket submission via web form, email parsing, and API
- Priority, status, category, and tag assignment
- Agent assignment with workload balancing view
- Internal notes (staff-only) and customer replies in threaded conversation
- Knowledge base with articles, categories, and search
- SLA tracking with escalation rules
- Canned responses / response templates
- Customer portal: submit tickets, view status, search knowledge base
- Dashboard: open tickets, response times, resolution rates

## Data Model (Prisma)
```prisma
model Ticket {
  id           String    @id @default(uuid())
  ticketNumber String    @unique // e.g. TK-00042
  subject      String
  status       String    @default("open") // open, pending, in_progress, resolved, closed
  priority     String    @default("medium") // low, medium, high, urgent
  category     String?
  tags         String[]
  customer     Customer  @relation(fields: [customerId], references: [id])
  customerId   String
  assignee     User?     @relation("AssignedTickets", fields: [assigneeId], references: [id])
  assigneeId   String?
  messages     TicketMessage[]
  slaDeadline  DateTime?
  firstResponseAt DateTime?
  resolvedAt   DateTime?
  closedAt     DateTime?
  source       String    @default("web") // web, email, api
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
}

model TicketMessage {
  id          String  @id @default(uuid())
  ticket      Ticket  @relation(fields: [ticketId], references: [id])
  ticketId    String
  content     String  // Markdown supported
  isInternal  Boolean @default(false) // true = staff note, not visible to customer
  author      User?   @relation(fields: [authorId], references: [id])
  authorId    String? // null if from customer
  customerAuthor Customer? @relation(fields: [customerAuthorId], references: [id])
  customerAuthorId String?
  attachments Attachment[]
  createdAt   DateTime @default(now())
}

model Customer {
  id        String    @id @default(uuid())
  name      String
  email     String    @unique
  phone     String?
  company   String?
  tickets   Ticket[]
  messages  TicketMessage[]
  portalToken String  @unique @default(uuid())
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

model KBArticle {
  id          String    @id @default(uuid())
  title       String
  slug        String    @unique
  content     String    // Markdown/HTML
  category    KBCategory? @relation(fields: [categoryId], references: [id])
  categoryId  String?
  isPublished Boolean   @default(false)
  viewCount   Int       @default(0)
  helpfulCount Int      @default(0)
  author      User      @relation(fields: [authorId], references: [id])
  authorId    String
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model KBCategory {
  id       String      @id @default(uuid())
  name     String
  slug     String      @unique
  order    Int         @default(0)
  articles KBArticle[]
}

model SLAPolicy {
  id                String @id @default(uuid())
  name              String
  priority          String // matches ticket priority
  firstResponseMins Int    // SLA for first response
  resolutionMins    Int    // SLA for resolution
  isActive          Boolean @default(true)
}

model CannedResponse {
  id       String @id @default(uuid())
  title    String
  content  String
  category String?
  author   User   @relation(fields: [authorId], references: [id])
  authorId String
}
```

## Key Pages / Routes
```
# Agent/Admin views
/dashboard                 — Open ticket count, SLA status, agent workload, trends
/tickets                   — Ticket list with status/priority/assignee filters
/tickets/[id]              — Ticket conversation thread, internal notes, actions
/tickets/new               — Create ticket on behalf of customer
/agents                    — Agent list with active ticket counts
/knowledge-base/admin      — Article management (create, edit, publish)
/canned-responses          — Manage response templates
/reports                   — Response times, resolution rates, volume by category
/settings/sla              — SLA policy configuration
/settings/categories       — Ticket category management
/settings/email            — Email parsing configuration (inbound address)

# Customer portal (public)
/portal                    — Customer login / ticket submission
/portal/tickets            — Customer's ticket list
/portal/tickets/[id]       — View ticket, add reply
/portal/new                — Submit new ticket
/portal/kb                 — Knowledge base search and browse
/portal/kb/[slug]          — Article view
```

## Email Integration
```typescript
// Inbound email parsing (e.g., support@client.com)
// Options: webhook from email provider, or IMAP polling
interface InboundEmail {
  from: string;       // → match or create Customer
  subject: string;    // → ticket subject (or match existing ticket from subject line)
  body: string;       // → first message content
  attachments: File[];
}

// Pattern: "Re: [TK-00042] Your subject" → append to existing ticket
// New email → create new ticket
```

## SLA Escalation Logic
```typescript
// Cron job runs every 5 minutes
async function checkSLAs() {
  const tickets = await getTicketsApproachingSLA();
  for (const ticket of tickets) {
    if (isPastFirstResponseSLA(ticket)) {
      await escalate(ticket, 'first_response_breached');
    }
    if (isPastResolutionSLA(ticket)) {
      await escalate(ticket, 'resolution_breached');
    }
    if (isApproachingSLA(ticket, warningThreshold)) {
      await notify(ticket.assignee, 'sla_warning');
    }
  }
}
```

## Client Customization Points
- Ticket categories and tags
- SLA policies per priority level
- Escalation rules and notification recipients
- Email parsing address and provider
- Knowledge base categories and structure
- Customer portal branding
- Canned response library
- Auto-assignment rules (round-robin, least busy, by category)
- Working hours for SLA calculation
- Ticket form custom fields
