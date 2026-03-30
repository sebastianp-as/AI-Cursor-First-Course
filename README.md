## Finance Dashboard AI (Next.js 14 + Prisma + Tailwind)

Personal finance dashboard with SQLite, charts, and heuristic AI insights.

### Tech
- Next.js 14 (App Router), React 18, TypeScript
- TailwindCSS (dark mode, glassmorphism)
- Chart.js via react-chartjs-2
- Icons via lucide-react
- Prisma ORM with SQLite
- API routes for transactions, categories, and insights

### Quickstart
1) Install dependencies
```bash
npm install
```
2) Configure database
```bash
cp .env.example .env  # or create .env with DATABASE_URL="file:./dev.db"
npx prisma db push
npm run db:seed
```
3) Run dev server
```bash
npm run dev
```
App: http://localhost:3000

### Scripts
- `npm run dev` — start Next.js in dev
- `npm run build` — production build
- `npm start` — start production build
- `npm run db:push` — push Prisma schema to SQLite
- `npm run db:seed` — seed default categories

### Notes
- AI insights are heuristic by default (no external API). If you add `OPENAI_API_KEY` to `.env` you can extend `app/api/insights/route.ts` to call an LLM instead.
- Charts are client components; SSR-safe with Next.js App Router.

