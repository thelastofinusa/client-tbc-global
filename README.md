## The Burning Church Global (TBCG)

A modern, full-stack community and church management platform for **The Burning Church Global** (located in Kudenda, Kaduna, Nigeria).

### About the Project

The Burning Church Global platform connects church members, visitors, and ministry leadership through an interactive portal and administrative dashboard.

**Core Capabilities**

- **Member Authentication & Profiles**: Secure registration and login via Better Auth with email/password and Google OAuth.
- **Role-Based Access Control (RBAC)**: Multi-tier access for:
  - `super_admin`: Full system control, role assignments, member approvals, reports, and settings.
  - `admin`: Operations, services, attendance management, and follow-ups.
  - `usher`: Venue attendance check-in management and QR display.
  - `media`: Services, announcements, and media updates.
  - `attendee`: Church member space with attendance history and personal profile.
- **Attendance & Gathering Check-In**: Dynamic QR code session generation for weekly services (Sunday, Wednesday, Saturday) with live attendee check-in scanner.
- **Projects & Outreach Drives**: Real-time project tracking (Building, Education, Outreach) with funding progress, goals, and sponsorship management.
- **Fellowship & Submissions**: Partnership and prayer request management.

### Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack, React 19)
- **Authentication**: [Better Auth](https://www.better-auth.com/) with Drizzle adapter & `nextCookies` plugin
- **Database & ORM**: [Neon Serverless PostgreSQL](https://neon.tech/) with [Drizzle ORM](https://orm.drizzle.team/)
- **UI & Styling**: [Tailwind CSS v4](https://tailwindcss.com/), Radix / Base UI, Motion, Lucide Icons
- **Tooling**: [Biome](https://biomejs.dev/) for formatting and linting, [Bun](https://bun.sh/) package manager

### Getting Started

**Prerequisites**

- [Bun](https://bun.sh/) installed (`curl -fsSL https://bun.sh/install | bash`) or Node.js 20+

**Installation**

1. **Clone the repository**:

   ```bash
   git clone <repo-url>
   cd tbcg
   ```

2. **Install dependencies**:

   ```bash
   bun install
   ```

3. **Configure environment variables**:
   Create a `.env.local` file by copying the example:
   ```bash
   cp .env.example .env.local
   ```

### Environment Variables & Where to Get the Keys

Configure the following variables in `.env.local`:

| Variable               | Description                                                   | Where to get it                                                                                                                                                                                                                                                                                  |
| ---------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `BETTER_AUTH_SECRET`   | 32+ character random secret used to sign sessions and tokens. | Run in your terminal:<br>`openssl rand -base64 32`                                                                                                                                                                                                                                               |
| `BETTER_AUTH_URL`      | Base URL of your application.                                 | Local: `http://localhost:3000`<br>Production: `https://your-domain.com`                                                                                                                                                                                                                          |
| `DATABASE_URL`         | PostgreSQL connection string for Neon.                        | 1. Log in to [Neon](https://console.neon.tech/)<br>2. Open your project dashboard<br>3. Copy the **Connection Details** string (e.g. `postgresql://user:pass@ep-....neon.tech/neondb?sslmode=require`)                                                                                           |
| `DATABASE_URL_POOLED`  | Connection pooler URL for Neon (optional).                    | Available on your Neon dashboard by toggling **Connection pooling**.                                                                                                                                                                                                                             |
| `GOOGLE_CLIENT_ID`     | OAuth Client ID for Google Sign-In.                           | 1. Go to [Google Cloud Console](https://console.cloud.google.com/)<br>2. Navigate to **APIs & Services** > **Credentials**<br>3. Create an **OAuth 2.0 Client ID** (Web application)<br>4. Add Authorized redirect URI:<br>`http://localhost:3000/api/auth/callback/google` (and production URL) |
| `GOOGLE_CLIENT_SECRET` | OAuth Client Secret for Google Sign-In.                       | Obtained alongside the `GOOGLE_CLIENT_ID` from the Google Cloud Console.                                                                                                                                                                                                                         |
| `SUPER_ADMIN_EMAILS`   | Comma-separated emails granted super admin dashboard access.  | Example: `pastor@burningchurch.org,admin@burningchurch.org`                                                                                                                                                                                                                                      |

_(Optional S3 variables `AWS_ENDPOINT_URL_S3`, `AWS_ACCESS_KEY_ID`, etc. can be configured if using object storage for media uploads)._

### Database & Drizzle ORM Workflow

The database schema is defined in [db/schema.ts](file:///Users/osilama/Desktop/tbcg/db/schema.ts). Drizzle Kit is configured in [drizzle.config.ts](file:///Users/osilama/Desktop/tbcg/drizzle.config.ts) to manage the `public` schema in your Neon database.

**Common Database Commands**

```bash
# 1. Apply schema changes directly to your Neon database (fast for development)
bun run db:push

# 2. Generate a new SQL migration file in ./drizzle from db/schema.ts
bun run db:generate

# 3. Apply pending migration files to the database (recommended for production)
bun run db:migrate

# 4. Open Drizzle Studio (web UI to inspect and manage tables)
bun run db:studio
```

> **Note on Push vs Migrate**:
>
> - `bun run db:push` synchronizes `db/schema.ts` directly with Neon without requiring migration files.
> - `bun run db:generate` followed by `bun run db:migrate` creates version-controlled SQL files in `drizzle/`.

### Development & Build Scripts

```bash
# Start local development server (with Turbopack)
bun run dev

# Run clean development server (clears .next cache)
bun run clean:dev

# Type-check and build for production
bun run build

# Start production server
bun run start

# Lint with Biome
bun run lint

# Format code with Biome
bun run format
```

### Project Structure

```
├── app/
│   ├── (routes)/
│   │   ├── (auth)/             # Sign-in and Sign-up pages with custom UI
│   │   ├── (dashboard)/        # Role-gated dashboard (attendance, members, projects)
│   │   ├── (landing)/          # Public website (services, projects, about, partner)
│   │   └── sso-callback/       # OAuth callback transition
│   ├── api/
│   │   └── auth/[...all]/      # Better Auth route handler
│   ├── layout.tsx              # Root HTML shell
│   └── globals.css             # Tailwind v4 styles
├── components/
│   ├── dashboard/              # Attendance scanner, member tables, charts
│   ├── shared/                 # Header, Footer, Logo, Show (auth-aware view)
│   └── reusable/shadcn/        # UI component primitives
├── db/
│   ├── index.ts                # Drizzle Neon client instance
│   └── schema.ts               # User, session, account, verification & church schema
├── drizzle/                    # Generated SQL migrations
├── drizzle.config.ts           # Drizzle Kit configuration
├── lib/
│   ├── auth/
│   │   ├── auth.ts             # Better Auth server configuration
│   │   └── auth-client.ts      # Better Auth React client with inferAdditionalFields
│   └── dashboard/              # Roles, permissions, access control logic
├── proxy.ts                    # Next.js 16 route proxy / auth middleware
└── package.json
```
