# DayBalance

DayBalance is a full-stack healthy daily habit planner built for the Web Programming project.

## Architecture
- **Client:** React + Vite single-page application, React Router, reusable components.
- **Server:** Node.js + Express using MVC-style routes/controllers/services.
- **Database:** MongoDB + Mongoose (6 related collections).
- **API:** REST endpoints documented with swagger-jsdoc and Swagger UI.
- **Authentication:** JWT Bearer authentication with bcrypt password hashing.

## Part 4 requirements
The final UI converts all 18 Part 1 screens into React routes/components: home, login, registration, explore, public habit detail, dashboard, my habits, add/edit/personal detail, progress, tips, weather, admin dashboard, users, categories, tips management and database utility.

### Roles
- **Guest:** public home, explore/search, habit details, tips and weather; no mutations.
- **Registered user:** own dashboard/habits/completions/progress; server enforces habit/completion ownership.
- **Admin:** users/categories/tips/database management plus normal authenticated features.

### Client document classes
`User`, `Category`, `Habit`, `HabitCompletion`, `HealthyTip`, `ActivityHistory` are ES6 client models used by the API service when converting responses.

### React equivalents of transformation pipes
React does not provide Angular pipes. DayBalance therefore uses reusable pure transformation utilities in `client/src/utils/transformers.js`: `formatDate`, `formatDuration`, `titleCase`, `timeOfDayLabel`, `difficultyLabel`, `filterBySearch`, and `completionPercentage`. They are used across cards, tables, search, dashboard, details and progress UI.

### Services
1. `client/src/services/api.js` centralizes DayBalance REST API calls and JWT headers.
2. `client/src/services/weather.js` integrates the external **Open-Meteo** geocoding/current-weather APIs and adds an outdoor/indoor habit suggestion.

### Other UI requirements
- Delete confirmation modal is reusable and used for habit/admin deletion.
- Progress uses Chart.js / react-chartjs-2 with real completion records from MongoDB.
- Forms use required fields, email/password checks, ranges, enum selects and time validation; server express-validator and Mongoose validation remain the authoritative validation layers.
- Browser back/forward and direct SPA route refresh are supported by React Router + Express fallback.

## Demo credentials after reset & seed
- Admin: `admin@daybalance.test` / `Admin123!`
- User: `user@daybalance.test` / `User123!`

These are development/demo accounts only. Seed passwords are bcrypt hashes in MongoDB and password fields are never returned by API responses.

## Local Docker run
Create `.env` if desired (never commit it), then:

```bash
docker compose up --build
```

Open `http://localhost:3000/`.

Useful endpoints:
- `GET /api/health`
- Swagger UI: `/api/docs/`
- OpenAPI JSON: `/api/swagger.json`
- Admin database page: `/db`

Environment variables: `MONGODB_URI`, `PORT`, `NODE_ENV`, `JWT_SECRET`.

## Database reset/seed
The React `/db` screen calls `POST /api/db/reset`, `/api/db/seed`, and `/api/db/reset-and-seed`. These operations require an authenticated admin JWT.

## Deployment
Cloud deployment is intentionally not claimed as complete yet. Production deployment and cross-browser verification are the final project steps.
