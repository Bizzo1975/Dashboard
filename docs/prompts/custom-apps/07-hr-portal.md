# Custom App 07: Employee / HR Portal

## Replaces
BambooHR, Gusto (HR portion), Paychex Flex

## Core Features
- Employee directory with profiles, contact info, and org chart
- PTO request and approval workflow with balance tracking
- Document storage: onboarding packets, policies, tax forms, contracts
- Company announcements and employee handbook
- Basic time-off balance tracking (vacation, sick, personal)
- Onboarding checklists for new hires
- Emergency contact management
- Employee self-service profile updates

## Data Model (Prisma)
```prisma
model Employee {
  id              String    @id @default(uuid())
  user            User      @relation(fields: [userId], references: [id])
  userId          String    @unique
  employeeNumber  String    @unique
  firstName       String
  lastName        String
  email           String
  personalEmail   String?
  phone           String?
  title           String
  department      Department? @relation(fields: [departmentId], references: [id])
  departmentId    String?
  manager         Employee?  @relation("ManagerReports", fields: [managerId], references: [id])
  managerId       String?
  directReports   Employee[] @relation("ManagerReports")
  startDate       DateTime
  endDate         DateTime?
  status          String     @default("active") // active, on_leave, terminated
  employmentType  String     @default("full_time") // full_time, part_time, contractor
  location        String?
  emergencyContacts EmergencyContact[]
  ptoRequests     PTORequest[]
  ptoBalances     PTOBalance[]
  documents       EmployeeDocument[]
  onboardingTasks OnboardingTask[]
  createdAt       DateTime   @default(now())
  updatedAt       DateTime   @updatedAt
}

model Department {
  id        String     @id @default(uuid())
  name      String
  head      Employee?  @relation("DeptHead", fields: [headId], references: [id])
  headId    String?
  employees Employee[]
}

model PTOPolicy {
  id              String  @id @default(uuid())
  name            String  // Vacation, Sick, Personal
  type            String  // vacation, sick, personal, other
  accrualRate     Decimal // hours per pay period
  accrualFrequency String @default("biweekly") // weekly, biweekly, monthly
  maxBalance      Decimal // maximum accrual cap
  carryoverMax    Decimal @default(0) // max hours carried to next year
  requiresApproval Boolean @default(true)
}

model PTOBalance {
  id          String   @id @default(uuid())
  employee    Employee @relation(fields: [employeeId], references: [id])
  employeeId  String
  policyType  String   // matches PTOPolicy.type
  balance     Decimal  // current available hours
  used        Decimal  @default(0) // hours used this period
  accrued     Decimal  @default(0) // hours accrued this period
  year        Int
  @@unique([employeeId, policyType, year])
}

model PTORequest {
  id          String   @id @default(uuid())
  employee    Employee @relation(fields: [employeeId], references: [id])
  employeeId  String
  type        String   // vacation, sick, personal
  startDate   DateTime
  endDate     DateTime
  hours       Decimal
  status      String   @default("pending") // pending, approved, denied, cancelled
  notes       String?
  approver    User?    @relation(fields: [approverId], references: [id])
  approverId  String?
  approvedAt  DateTime?
  deniedAt    DateTime?
  denyReason  String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model EmployeeDocument {
  id          String   @id @default(uuid())
  employee    Employee @relation(fields: [employeeId], references: [id])
  employeeId  String
  name        String
  category    String   // onboarding, policy, tax, contract, review, other
  fileUrl     String
  fileSize    Int
  uploadedBy  User     @relation(fields: [uploadedById], references: [id])
  uploadedById String
  isConfidential Boolean @default(false)
  expiresAt   DateTime?
  createdAt   DateTime @default(now())
}

model Announcement {
  id          String   @id @default(uuid())
  title       String
  content     String   // Markdown
  priority    String   @default("normal") // normal, important, urgent
  author      User     @relation(fields: [authorId], references: [id])
  authorId    String
  publishedAt DateTime @default(now())
  expiresAt   DateTime?
  isPinned    Boolean  @default(false)
  departments String[] // empty = all departments
  createdAt   DateTime @default(now())
}

model OnboardingTask {
  id          String   @id @default(uuid())
  employee    Employee @relation(fields: [employeeId], references: [id])
  employeeId  String
  title       String
  description String?
  category    String   // paperwork, equipment, training, access, introduction
  isCompleted Boolean  @default(false)
  completedAt DateTime?
  dueDate     DateTime?
  order       Int      @default(0)
}

model EmergencyContact {
  id          String   @id @default(uuid())
  employee    Employee @relation(fields: [employeeId], references: [id])
  employeeId  String
  name        String
  relationship String
  phone       String
  email       String?
  isPrimary   Boolean  @default(false)
}
```

## Key Pages / Routes
```
# Employee self-service
/dashboard                — Announcements, PTO balances, upcoming time off
/directory                — Employee directory with search and org chart
/directory/[id]           — Employee profile (public info)
/my-profile               — Edit own profile, emergency contacts
/pto                      — View balances, request time off
/pto/request              — Submit PTO request
/pto/calendar             — Team calendar showing who's out
/documents                — My documents (tax forms, contracts, policies)
/handbook                 — Company handbook viewer
/onboarding               — New hire checklist (if applicable)

# Manager views
/team                     — Direct reports overview
/team/pto-requests        — Pending PTO approvals
/team/[id]                — Direct report's profile and details

# Admin / HR views
/admin/employees          — Full employee management
/admin/employees/new      — Add new employee + trigger onboarding
/admin/employees/[id]     — Full employee record (confidential)
/admin/departments        — Department management
/admin/pto-policies       — PTO policy configuration
/admin/announcements      — Create/manage announcements
/admin/onboarding-templates — Onboarding checklist templates
/admin/documents          — Company-wide document management
/admin/reports            — Headcount, PTO usage, tenure reports
```

## PTO Approval Workflow
```
Employee submits request
  → Manager receives notification (email + in-app)
  → Manager approves/denies
    → If approved: balance deducted, team calendar updated, employee notified
    → If denied: employee notified with reason
    → If pending > 48 hours: reminder sent to manager
```

## Client Customization Points
- PTO policy types, accrual rates, and caps
- Department structure
- Onboarding checklist templates by role/department
- Document categories
- Approval workflow (single manager vs. multi-level)
- Employee profile fields
- Announcement targeting (by department, location, etc.)
- Branding and theming
