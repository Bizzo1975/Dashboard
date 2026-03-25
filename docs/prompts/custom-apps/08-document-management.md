# Custom App 08: Document Management System

## Replaces
SharePoint, Google Drive (structured use), DocuWare

## Core Features
- File upload with folder hierarchy and drag-and-drop
- Version history with rollback capability
- Full-text search across documents (PDF, DOCX, TXT content extraction)
- Permission-based access control (per folder and per document)
- Document check-out/check-in workflow for collaborative editing
- Audit trail of all file activities (view, download, edit, share)
- File sharing via expiring links
- Tagging and metadata on documents
- Bulk upload and download

## Data Model (Prisma)
```prisma
model Folder {
  id          String   @id @default(uuid())
  name        String
  parent      Folder?  @relation("FolderTree", fields: [parentId], references: [id])
  parentId    String?
  children    Folder[] @relation("FolderTree")
  documents   Document[]
  permissions FolderPermission[]
  path        String   // materialized path: /root/subfolder/child
  createdBy   User     @relation(fields: [createdById], references: [id])
  createdById String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Document {
  id            String    @id @default(uuid())
  name          String
  mimeType      String
  size          Int       // bytes
  folder        Folder    @relation(fields: [folderId], references: [id])
  folderId      String
  currentVersion DocumentVersion? @relation("CurrentVersion", fields: [currentVersionId], references: [id])
  currentVersionId String? @unique
  versions      DocumentVersion[] @relation("DocumentVersions")
  tags          String[]
  metadata      Json?
  isCheckedOut  Boolean   @default(false)
  checkedOutBy  User?     @relation("CheckedOutDocs", fields: [checkedOutById], references: [id])
  checkedOutById String?
  checkedOutAt  DateTime?
  searchContent String?   // extracted text for full-text search
  auditLog      AuditEntry[]
  shareLinks    ShareLink[]
  createdBy     User      @relation(fields: [createdById], references: [id])
  createdById   String
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  deletedAt     DateTime?
}

model DocumentVersion {
  id          String   @id @default(uuid())
  document    Document @relation("DocumentVersions", fields: [documentId], references: [id])
  documentId  String
  version     Int
  fileUrl     String   // path in MinIO/object storage
  size        Int
  comment     String?  // version comment
  uploadedBy  User     @relation(fields: [uploadedById], references: [id])
  uploadedById String
  createdAt   DateTime @default(now())
}

model AuditEntry {
  id          String   @id @default(uuid())
  document    Document @relation(fields: [documentId], references: [id])
  documentId  String
  action      String   // viewed, downloaded, uploaded, deleted, shared, checked_out, checked_in
  user        User     @relation(fields: [userId], references: [id])
  userId      String
  details     String?
  ipAddress   String?
  createdAt   DateTime @default(now())
}

model ShareLink {
  id          String    @id @default(uuid())
  document    Document  @relation(fields: [documentId], references: [id])
  documentId  String
  token       String    @unique @default(uuid())
  expiresAt   DateTime?
  password    String?
  downloadCount Int     @default(0)
  maxDownloads Int?
  createdBy   User      @relation(fields: [createdById], references: [id])
  createdById String
  createdAt   DateTime  @default(now())
}

model FolderPermission {
  id       String @id @default(uuid())
  folder   Folder @relation(fields: [folderId], references: [id])
  folderId String
  userId   String?
  role     String? // or role-based
  level    String  // view, download, upload, edit, admin
  @@unique([folderId, userId])
}
```

## Key Pages / Routes
```
/                          — Root folder browser
/folder/[id]               — Folder contents with breadcrumbs
/document/[id]             — Document detail, versions, audit log
/document/[id]/versions    — Version history with diff/rollback
/search                    — Full-text search across all accessible documents
/shared                    — Documents shared with me
/recent                    — Recently accessed documents
/trash                     — Soft-deleted documents (restore or permanent delete)
/admin/permissions         — Folder/role permission management
/admin/audit               — System-wide audit log
/share/[token]             — Public share link download page
```

## Storage Backend
- Use MinIO (S3-compatible) for file storage on Kecktech infrastructure
- PostgreSQL for metadata, search index, and audit trail
- Content extraction: `pdf-parse` for PDFs, `mammoth` for DOCX, plain text for TXT/CSV

## Client Customization Points
- Folder structure templates by industry
- Permission model (simple vs. granular)
- Metadata fields per document type
- Retention policies (auto-archive after N days)
- Storage quotas per user/department
- Check-out workflow toggle
- Branding on share link pages
