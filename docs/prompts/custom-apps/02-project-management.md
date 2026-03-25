# Custom App 02: Project Management / Task Tracker

## Replaces
Asana, Monday.com, Trello, Basecamp

## Core Features
- Workspace → Project → Task → Subtask hierarchy
- Kanban board, list view, and Gantt chart views
- Task assignment, due dates, priorities, and labels
- File attachments and threaded comments on tasks
- Time tracking per task with manual and timer entry
- Project templates for repeatable workflows
- Real-time updates via WebSockets (task moves, new comments)
- Notifications (in-app + email digest)

## Data Model (Prisma)
```prisma
model Workspace {
  id          String    @id @default(uuid())
  name        String
  description String?
  projects    Project[]
  members     WorkspaceMember[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Project {
  id          String    @id @default(uuid())
  name        String
  description String?
  color       String?
  workspace   Workspace @relation(fields: [workspaceId], references: [id])
  workspaceId String
  status      String    @default("active") // active, archived, completed
  tasks       Task[]
  columns     BoardColumn[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model BoardColumn {
  id        String  @id @default(uuid())
  name      String
  order     Int
  color     String?
  project   Project @relation(fields: [projectId], references: [id])
  projectId String
  tasks     Task[]
}

model Task {
  id          String    @id @default(uuid())
  title       String
  description String?   // Rich text / Markdown
  status      String    @default("todo")
  priority    String    @default("medium") // low, medium, high, urgent
  project     Project   @relation(fields: [projectId], references: [id])
  projectId   String
  column      BoardColumn? @relation(fields: [columnId], references: [id])
  columnId    String?
  columnOrder Int       @default(0) // position within column
  assignee    User?     @relation(fields: [assigneeId], references: [id])
  assigneeId  String?
  parent      Task?     @relation("Subtasks", fields: [parentId], references: [id])
  parentId    String?
  subtasks    Task[]    @relation("Subtasks")
  labels      Label[]
  dueDate     DateTime?
  startDate   DateTime?
  estimatedHours Float?
  attachments Attachment[]
  comments    Comment[]
  timeEntries TimeEntry[]
  createdBy   User      @relation("TaskCreator", fields: [createdById], references: [id])
  createdById String
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  completedAt DateTime?
  deletedAt   DateTime?
}

model TimeEntry {
  id          String   @id @default(uuid())
  task        Task     @relation(fields: [taskId], references: [id])
  taskId      String
  user        User     @relation(fields: [userId], references: [id])
  userId      String
  duration    Int      // minutes
  description String?
  date        DateTime @default(now())
  createdAt   DateTime @default(now())
}

model Comment {
  id        String   @id @default(uuid())
  content   String   // Markdown supported
  task      Task     @relation(fields: [taskId], references: [id])
  taskId    String
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Label {
  id    String @id @default(uuid())
  name  String
  color String
  tasks Task[]
}
```

## Key Pages / Routes
```
/                           — Workspace selector / recent projects
/workspace/[id]             — Project list with status indicators
/project/[id]               — Kanban board (default view)
/project/[id]/list          — List view with sorting/filtering
/project/[id]/gantt         — Gantt chart timeline view
/project/[id]/settings      — Project settings, columns, members
/task/[id]                  — Task detail modal/page (description, comments, time, subtasks)
/my-tasks                   — All tasks assigned to current user across projects
/time-tracking              — Time entry log with project/date filtering
/reports                    — Project progress, burndown, time reports
```

## Real-Time Features (WebSocket)
- Task moved between columns → all viewers see update
- New comment added → task subscribers notified
- Task assigned → assignee notified
- Use Socket.io or server-sent events for simplicity

## Client Customization Points
- Board column names and workflow stages
- Priority levels and labels
- Custom fields on tasks
- Project templates with pre-configured columns and task lists
- Notification preferences
- Time tracking toggle (some clients won't need it)
- Gantt chart toggle (optional per deployment)
