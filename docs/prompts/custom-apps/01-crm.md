# Custom App 01: CRM (Customer Relationship Management)

## Replaces
Salesforce, HubSpot, Zoho CRM

## Core Features
- Contact and company management with custom fields
- Deal pipeline with drag-and-drop Kanban stages
- Activity timeline (calls, emails, meetings, notes) per contact/deal
- Email integration (send/receive from within CRM)
- Task management tied to contacts and deals
- Reporting dashboard (pipeline value, conversion rates, activity metrics)
- CSV import/export for contacts and deals
- Search and filter across all entities

## Data Model (Prisma)
```prisma
model Contact {
  id          String   @id @default(uuid())
  firstName   String
  lastName    String
  email       String?
  phone       String?
  company     Company? @relation(fields: [companyId], references: [id])
  companyId   String?
  title       String?
  source      String?  // lead source
  tags        String[] // flexible tagging
  customFields Json?
  activities  Activity[]
  deals       Deal[]
  tasks       Task[]
  owner       User     @relation(fields: [ownerId], references: [id])
  ownerId     String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  deletedAt   DateTime?
}

model Company {
  id          String    @id @default(uuid())
  name        String
  domain      String?
  industry    String?
  size        String?
  address     String?
  contacts    Contact[]
  deals       Deal[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Deal {
  id          String   @id @default(uuid())
  title       String
  value       Decimal?
  currency    String   @default("USD")
  stage       String   // maps to pipeline stages
  probability Int?     // 0-100
  contact     Contact? @relation(fields: [contactId], references: [id])
  contactId   String?
  company     Company? @relation(fields: [companyId], references: [id])
  companyId   String?
  expectedClose DateTime?
  activities  Activity[]
  tasks       Task[]
  owner       User     @relation(fields: [ownerId], references: [id])
  ownerId     String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  closedAt    DateTime?
  deletedAt   DateTime?
}

model Activity {
  id          String   @id @default(uuid())
  type        String   // call, email, meeting, note
  subject     String
  description String?
  contact     Contact? @relation(fields: [contactId], references: [id])
  contactId   String?
  deal        Deal?    @relation(fields: [dealId], references: [id])
  dealId      String?
  user        User     @relation(fields: [userId], references: [id])
  userId      String
  occurredAt  DateTime @default(now())
  createdAt   DateTime @default(now())
}

model PipelineStage {
  id          String @id @default(uuid())
  name        String
  order       Int
  color       String?
  isDefault   Boolean @default(false)
  isClosedWon Boolean @default(false)
  isClosedLost Boolean @default(false)
}
```

## Key Pages / Routes
```
/dashboard              — KPI cards, pipeline chart, recent activity
/contacts               — Contact list with search/filter/sort
/contacts/[id]          — Contact detail with activity timeline
/companies              — Company list
/companies/[id]         — Company detail with linked contacts/deals
/deals                  — Pipeline Kanban view (default) + list view toggle
/deals/[id]             — Deal detail with stage history
/activities             — Activity feed (filterable by type, user, date)
/reports                — Pipeline value by stage, conversion funnel, activity metrics
/settings/pipeline      — Configure pipeline stages
/settings/custom-fields — Manage custom fields for contacts/deals
```

## UI Components Needed
- Kanban board with drag-and-drop (deals pipeline)
- Activity timeline component (chronological feed)
- Contact/company cards with quick-action buttons
- Data table with column sorting, filtering, pagination
- KPI stat cards for dashboard
- Pipeline funnel visualization

## Client Customization Points
- Pipeline stages (names, count, colors)
- Custom fields on contacts, companies, deals
- Activity types
- Dashboard widgets and KPIs displayed
- Branding and theming (colors, logo)
- Email integration configuration
- User roles beyond the standard set
