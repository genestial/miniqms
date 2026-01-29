# Mini QMS - ISO 9001 Quality Management System

A modern, lightweight Quality Management System for SMEs to become and remain ISO 9001 audit-ready.

## Features

- Multi-tenant SaaS architecture with strict tenant isolation
- ISO 9001 compliance tracking with clause cards
- Next Best Actions engine for prioritized task management
- Core modules: Processes, Risks, Problems, Evidence, Audits, Reviews, Objectives
- Company Profile & Organisation Context management
- S3-compatible file storage with signed URLs
- Onboarding wizard for SME-friendly setup

## Tech Stack

- **Frontend/Backend:** Next.js 14+ (App Router) with TypeScript
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** NextAuth.js
- **File Storage:** S3-compatible storage (AWS S3, Vercel Blob, or compatible)
- **Styling:** Tailwind CSS + shadcn/ui components

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- S3-compatible storage (AWS S3, Vercel Blob, etc.)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

Configure:
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - Secret for NextAuth.js
- `NEXTAUTH_URL` - Your application URL
- `AWS_REGION` - AWS region (or S3-compatible service region)
- `AWS_ACCESS_KEY_ID` - AWS access key
- `AWS_SECRET_ACCESS_KEY` - AWS secret key
- `S3_BUCKET_NAME` - S3 bucket name

3. Set up database:
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

4. Run development server:
```bash
npm run dev
```

## Project Structure

```
miniQMS/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                 # ISO 9001 clause seed data
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # Authentication pages
│   │   ├── (dashboard)/        # Dashboard and module pages
│   │   ├── onboarding/         # Onboarding wizard
│   │   └── api/                 # API routes
│   ├── components/             # React components
│   │   ├── ui/                 # shadcn/ui components
│   │   └── dashboard/          # Dashboard components
│   ├── lib/                    # Core libraries
│   │   ├── db.ts               # Scoped Prisma client
│   │   ├── storage.ts          # S3 storage abstraction
│   │   ├── standards.ts        # Standards engine
│   │   ├── compliance.ts       # Compliance calculation
│   │   └── actions.ts          # Next Best Actions engine
│   └── types/                  # TypeScript types
```

## Key Features

### Multi-Tenant Isolation

All database operations go through a scoped Prisma helper that enforces tenant isolation. No direct Prisma client usage is allowed.

### Compliance Dashboard

The dashboard shows:
- Readiness Summary (percentage + legend)
- Clause Cards (status, plain-English "why", missing items, fix CTAs)
- Next Best Actions (top 3-5 prioritized tasks)
- Attention Needed (overdue items, pending approvals)

### Storage

All files are stored using S3-compatible storage with `storage_key` pattern. Signed URLs are generated on demand for secure access.

## Development

### Database Migrations

```bash
npx prisma migrate dev
```

### Seeding ISO Clauses

```bash
npm run db:seed
```

## License

MIT
