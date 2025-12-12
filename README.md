# Cleanough

An open source, git-powered code presentation platform that transforms GitHub repositories into interactive, presentation-ready experiences. Browse, explore, and present code commits in a VS Code-like interface.

<h1 align="center">
   <picture>
   <source media="(prefers-color-scheme: dark)" srcset="public/images/bg-dark.png">
   <img alt="supasheet" width="100%" src="public/images/bg-light.png">
   </picture>
</h1>

## Features

### Explorer Mode
- Browse repository files with a familiar VS Code-style interface
- Syntax highlighting for 50+ programming languages via Monaco Editor
- Media preview support (images, audio, video)
- Tabbed interface for managing multiple open files
- Breadcrumb navigation and file tree explorer

### History Mode
- Step through commits like presentation slides
- View detailed commit information and file diffs
- Navigate between changes with precision controls
- Infinite scrolling pagination through commit history

### Output Mode
- Showcase execution results alongside code
- Display terminal outputs and rendered images
- Metadata-driven output organization via `__cleanough/meta.json`

## Tech Stack

- **Frontend**: React 19, TanStack Router, TanStack Query, Vite
- **UI**: Chakra UI 3, Monaco Editor
- **Backend**: TanStack Start, Better Auth, Drizzle ORM
- **Database**: PostgreSQL
- **Integration**: GitHub API (Octokit)

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- PostgreSQL database
- GitHub OAuth App credentials

### Installation

```bash
pnpm install
```

### Environment Variables

Create a `.env` file with the following variables:

```env
DATABASE_URL=your_postgres_connection_string
GITHUB_CLIENT_ID=your_github_oauth_client_id
GITHUB_CLIENT_SECRET=your_github_oauth_client_secret
BETTER_AUTH_SECRET=your_auth_secret
```

### Development

```bash
pnpm start
```

### Production Build

```bash
pnpm build
```

## Project Structure

```
src/
├── components/
│   ├── dashboard/      # Repository browser components
│   ├── editor/         # VS Code-like editor components
│   └── landing/        # Landing page components
├── db/                 # Database schema and configuration
├── hooks/              # Custom React hooks
├── integrations/       # Third-party integrations (Chakra UI, TanStack Query)
├── lib/                # Utilities (auth, GitHub API, file helpers)
├── routes/             # TanStack Router file-based routes
└── types/              # TypeScript type definitions
```

## Repository Metadata

Repositories can include an optional `__cleanough/meta.json` file to customize the presentation experience:

```json
{
  "order": ["README.md", "src/index.ts"],
  "outputs": [
    {
      "commit": "abc123",
      "type": "terminal",
      "content": "Build successful!"
    }
  ]
}
```

## Use Cases

- **Tutorials**: Create step-by-step code walkthroughs with visual outputs
- **Portfolio**: Present projects to potential employers
- **Education**: Teach programming concepts with commit-by-commit progression
- **Conferences**: Interactive code samples for talks and presentations
- **Code Reviews**: Visualize code evolution and refactoring

## Scripts

```bash
pnpm start     # Start development server
pnpm build     # Build for production
pnpm test      # Run tests
pnpm lint      # Run ESLint
pnpm format    # Format code with Prettier
pnpm check     # Type check
```

## License

MIT
