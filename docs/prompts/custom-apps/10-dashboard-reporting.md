# Custom App 10: Business Dashboard / Reporting Tool

## Replaces
Google Data Studio (Looker Studio), Tableau (basic), Power BI (basic)

## Core Features
- Customizable widget-based dashboards with drag-and-drop layout
- Chart types: bar, line, area, pie/donut, KPI cards, tables, gauges, scatter
- Data source connectors: PostgreSQL, MySQL, REST APIs, CSV/Excel import
- Scheduled email reports (daily, weekly, monthly) with PDF snapshots
- Role-based dashboard sharing (view-only, edit, admin)
- Dashboard templates for common business metrics
- Date range filtering and comparison (this period vs. last period)
- Auto-refresh with configurable intervals
- Export: PDF, PNG, CSV (per widget)

## Data Model (Prisma)
```prisma
model Dashboard {
  id          String    @id @default(uuid())
  title       String
  description String?
  layout      Json      // widget positions: [{widgetId, x, y, w, h}]
  widgets     Widget[]
  isPublic    Boolean   @default(false)
  publicToken String?   @unique
  refreshInterval Int?  // seconds, null = manual only
  createdBy   User      @relation(fields: [createdById], references: [id])
  createdById String
  shares      DashboardShare[]
  schedules   ReportSchedule[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Widget {
  id          String    @id @default(uuid())
  dashboard   Dashboard @relation(fields: [dashboardId], references: [id])
  dashboardId String
  title       String
  type        String    // bar, line, area, pie, donut, kpi, table, gauge, scatter, number
  dataSource  DataSource @relation(fields: [dataSourceId], references: [id])
  dataSourceId String
  query       Json      // query config: { table/endpoint, measures, dimensions, filters, sort, limit }
  config      Json      // visual config: { colors, legend, axis labels, format, thresholds }
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model DataSource {
  id          String   @id @default(uuid())
  name        String
  type        String   // postgresql, mysql, rest_api, csv, excel
  config      Json     // connection details (encrypted)
  // For DB: { host, port, database, username, password, ssl }
  // For API: { baseUrl, headers, authType, authConfig }
  // For CSV: { fileUrl, delimiter, hasHeaders }
  lastTestedAt DateTime?
  isActive    Boolean  @default(true)
  widgets     Widget[]
  createdBy   User     @relation(fields: [createdById], references: [id])
  createdById String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model DashboardShare {
  id          String    @id @default(uuid())
  dashboard   Dashboard @relation(fields: [dashboardId], references: [id])
  dashboardId String
  user        User      @relation(fields: [userId], references: [id])
  userId      String
  permission  String    @default("view") // view, edit
  @@unique([dashboardId, userId])
}

model ReportSchedule {
  id          String    @id @default(uuid())
  dashboard   Dashboard @relation(fields: [dashboardId], references: [id])
  dashboardId String
  frequency   String    // daily, weekly, monthly
  dayOfWeek   Int?      // 0-6 for weekly
  dayOfMonth  Int?      // 1-31 for monthly
  timeOfDay   String    // "08:00"
  timezone    String    @default("America/Chicago")
  recipients  String[]  // email addresses
  format      String    @default("pdf") // pdf, png
  isActive    Boolean   @default(true)
  lastSentAt  DateTime?
  createdAt   DateTime  @default(now())
}

model CachedQuery {
  id          String   @id @default(uuid())
  queryHash   String   @unique // hash of datasource + query config
  result      Json
  expiresAt   DateTime
  createdAt   DateTime @default(now())
}
```

## Key Pages / Routes
```
/                          — Dashboard list (my dashboards + shared with me)
/dashboard/new             — Create dashboard (select template or blank)
/dashboard/[id]            — View dashboard (responsive grid)
/dashboard/[id]/edit       — Edit mode: add/remove/configure widgets, drag to reposition
/dashboard/[id]/settings   — Sharing, scheduling, refresh settings
/widget/[id]/configure     — Widget query builder and visual config
/data-sources              — Manage data source connections
/data-sources/new          — Add new data source with connection test
/data-sources/[id]/explore — Browse tables/endpoints, preview data
/templates                 — Dashboard templates (sales, marketing, operations, finance)
/public/[token]            — Public dashboard view (read-only, no auth)
```

## Query Builder UI
The widget query builder should provide a visual interface:
```
┌─ Data Source: [Select source] ─────────────────────┐
│                                                      │
│  Measures:    [Revenue ▼] [Count ▼] [+ Add]        │
│  Dimensions:  [Month ▼] [Product ▼] [+ Add]        │
│  Filters:     [Date >= 2025-01-01] [+ Add]          │
│  Sort:        [Revenue DESC] [+ Add]                │
│  Limit:       [100]                                  │
│                                                      │
│  [Preview Data]  [Apply]                             │
└──────────────────────────────────────────────────────┘
```

For advanced users, also provide a raw SQL/query editor with syntax highlighting.

## Chart Library
- Use **Recharts** as primary charting library (React-native, composable)
- Fallback to **D3.js** for custom/complex visualizations
- KPI cards are custom components (large number + trend arrow + comparison)
- Tables use the shared DataTable component with sorting/pagination

## Data Source Security
- Database credentials encrypted at rest (use `crypto` module with app-level encryption key)
- API tokens stored encrypted
- Query execution runs through a sandboxed connection pool (no arbitrary SQL from frontend)
- Read-only database connections recommended for all data sources
- Query timeout limits (30 seconds default)
- Result row limits (10,000 default)

## Scheduled Reports
- Cron job runs at configured intervals
- Renders dashboard to PDF using Puppeteer (headless browser screenshot)
- Sends via email with PDF attachment
- Logs delivery status

## Client Customization Points
- Data source types needed (most clients only need 1-2)
- Dashboard templates relevant to their industry
- Chart color palettes matching their brand
- KPI definitions and thresholds
- Report scheduling options
- User permission model (who can create vs. view)
- Data refresh frequency limits
- Row/query limits based on deployment size
