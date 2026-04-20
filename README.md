# 华史通鉴 - 中国历史查询系统

A full-stack Chinese history knowledge query platform with authentication, built with React + Express + PostgreSQL.

## Project Structure

```
.
├── backend/
│   ├── config/
│   │   ├── constants.ts        # Server config (PORT, NODE_ENV)
│   │   └── passport.ts         # Passport JWT strategy
│   ├── db/
│   │   ├── index.ts            # Drizzle + postgres.js connection
│   │   ├── schema.ts           # Users table + Zod schemas + types
│   │   └── migrations/
│   │       └── 0_init_add_user_model.sql
│   ├── middleware/
│   │   ├── auth.ts             # JWT authentication middleware (authenticateJWT)
│   │   └── errorHandler.ts     # Global error handler
│   ├── repositories/
│   │   └── users.ts            # User data access layer
│   ├── routes/
│   │   └── auth.ts             # /api/auth/* routes (signup, login, me, profile, change-password)
│   └── server.ts               # Express entry point
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── custom/
│       │   │   ├── Login.tsx       # Login page component
│       │   │   ├── Signup.tsx      # Signup page component
│       │   │   ├── Profile.tsx     # User profile management
│       │   │   └── OmniflowBadge.tsx
│       │   └── ui/             # shadcn/ui components
│       ├── contexts/
│       │   └── AuthContext.tsx  # Auth state (isAuthenticated, login, logout)
│       ├── pages/
│       │   └── Index.tsx        # Main app (home, events, persons, dynasties, knowledge, map, learning, tools)
│       ├── types/
│       │   └── index.ts         # Shared TypeScript types
│       ├── config/
│       │   └── constants.ts     # API_BASE_URL
│       └── App.tsx              # HashRouter + AuthProvider + protected routes
```

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS V4, shadcn/ui, React Router DOM (HashRouter)
- **Backend**: Express.js, TypeScript, Drizzle ORM, postgres.js
- **Auth**: JWT (jsonwebtoken), bcryptjs, Passport.js
- **Database**: PostgreSQL
- **Fonts**: Noto Serif SC, Noto Sans SC, JetBrains Mono
- **Design**: Imperial Scroll style — vermilion (#a72323), ink-black (#2C1810), gold (#C4922A)

## Key Files

- `backend/db/schema.ts` — Users table definition, Zod insert/update schemas, exported types
- `backend/repositories/users.ts` — Repository pattern: findByEmail, findById, create, update
- `backend/routes/auth.ts` — Auth endpoints with Zod validation
- `backend/middleware/auth.ts` — `authenticateJWT` middleware, sets `req.user = { id, email, name, role }`
- `frontend/src/contexts/AuthContext.tsx` — `useAuth()` hook: `{ isAuthenticated, login, logout }`
- `frontend/src/pages/Index.tsx` — Main app with 8 views: home, events, persons, dynasties, knowledge, map, learning, tools
- `frontend/src/components/custom/Profile.tsx` — Profile tabs: info, bookmarks, notes, security

## API Routes

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/auth/signup | No | Register (name, email, password, confirmPassword) |
| POST | /api/auth/login | No | Login (email, password) → JWT token |
| GET | /api/auth/me | Yes | Get current user profile |
| PUT | /api/auth/profile | Yes | Update name, bio, avatar |
| PUT | /api/auth/change-password | Yes | Change password |

## Auth Flow

1. JWT token stored in `localStorage.getItem('token')`
2. `AuthContext` verifies token via `/api/auth/me` on load
3. `isAuthenticated: null` = loading, `true` = authenticated, `false` = not authenticated
4. All protected routes redirect to `/login` when unauthenticated
5. Login/Signup redirect to `/` on success

## App Features (PRD)

- **智能搜索**: 4-mode search (events, persons, dynasties, periods) with hot search terms
- **历史事件**: Structured event cards with time, location, figures, bookmarking
- **历史人物**: Person profiles with alias, dynasty, role, bookmarking
- **朝代政权**: Dynasty timeline + detail cards with achievements
- **知识图谱**: Event causality chains, person relationship graphs, spatiotemporal evolution
- **时空地图**: Historical map with period selection and route tracking
- **学习笔记**: Note-taking, quiz system with adaptive difficulty
- **学术工具**: Year conversion (Gregorian/Era/Ganzhi), citation generator, source tracing
- **用户认证**: Login, signup, profile management, password change, bookmarks, notes

## Code Generation Guidelines

- Repository methods accept `z.infer<typeof insertXSchema>` types, use `as InsertX` only in `.values()`
- All API responses: `{ success: boolean, data: T, message?: string }`
- Frontend uses `localStorage.getItem('token')` for auth header: `Authorization: Bearer <token>`
- Use `authenticateJWT` (not `authenticateToken`) for protected routes
- HashRouter: use `useNavigate('/path')` not `window.location.href = '/#/path'`
- Notes and bookmarks stored in localStorage keys: `history_notes`, `history_bookmarks`
