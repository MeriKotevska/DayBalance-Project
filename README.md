# DayBalance

DayBalance is a healthy daily habit planner designed to help people organize small routines, complete habits, and understand their consistency.

## Part 1: static prototype

The visual prototype consists of static HTML pages with shared CSS and a small amount of vanilla JavaScript for the mobile navigation toggle and confirmation modals. All Part 1 pages continue to work exactly as before — Express now serves them as static files.

## Part 2: Express + MongoDB + MVC foundation

Part 2 adds a Node.js/Express server with an MVC-style structure and a MongoDB (Mongoose) data layer. There is no server-side rendered view engine — the existing static HTML frontend is served directly by Express, and a future part will replace it with a React SPA.

## Part 3: REST API, validation, Swagger, and database seed/reset

Part 3 implements the full REST API, input validation, OpenAPI documentation, and functional database seed/reset.

### REST API

Full CRUD endpoints for all six resources:

| Resource | Endpoints |
|---|---|
| Users | `GET/POST /api/users`, `GET/PUT/DELETE /api/users/:id` |
| Categories | `GET/POST /api/categories`, `GET/PUT/DELETE /api/categories/:id` |
| Habits | `GET/POST /api/habits`, `GET/PUT/DELETE /api/habits/:id` |
| Completions | `GET/POST /api/completions`, `GET/PUT/DELETE /api/completions/:id` |
| Tips | `GET/POST /api/tips`, `GET/PUT/DELETE /api/tips/:id` |
| Activity | `GET/POST /api/activity`, `GET/PUT/DELETE /api/activity/:id` |
| Database | `POST /api/db/reset`, `POST /api/db/seed`, `POST /api/db/reset-and-seed` |

HTTP status codes used: 200, 201, 204, 400, 404, 409, 500.

### Query / search support

- `GET /api/habits?search=water` — search by name
- `GET /api/habits?category=<id>` — filter by category
- `GET /api/habits?timeOfDay=morning` — filter by time of day
- `GET /api/tips?search=sleep` — search titles and content
- `GET /api/completions?habit=<id>&user=<id>&completed=true` — filter completions
- `GET /api/activity?user=<id>&targetType=Habit` — filter activity

### Validation

Two validation layers:
1. **API layer** — express-validator middleware validates POST/PUT bodies before reaching controllers (email format, required fields, string lengths, MongoDB IDs, enums, numeric ranges, dates). Returns 400 with structured JSON.
2. **Mongoose layer** — schema-level validation as a second safety net.

### Swagger / OpenAPI

The OpenAPI spec is generated from JSDoc comments in route files using swagger-jsdoc.

- **Swagger UI:** `http://localhost:3000/api/docs/`
- **Swagger JSON:** `http://localhost:3000/api/swagger.json`

Reusable schemas are defined for all models, plus ValidationError and Error response types.

### Database seed/reset

The `db.html` page is now functional. Three buttons call the API:
- **Reset Database** — `POST /api/db/reset` — deletes all data from all six collections
- **Seed Initial Data** — `POST /api/db/seed` — inserts realistic DayBalance sample data (categories, users, habits, completions, tips, activity)
- **Reset & Seed** — `POST /api/db/reset-and-seed` — resets then seeds in one operation

Sample data includes: Drink Water, Morning Walk, Read 20 Minutes, Meditation, Sleep Routine, Eat Breakfast, plus healthy tips and activity history.

### HabitCompletion daily uniqueness

The HabitCompletion model uses a `dayKey` field (YYYY-MM-DD format) with a unique compound index on `user + habit + dayKey` to ensure one completion per habit per user per calendar day.

### Key URLs

| URL | Description |
|---|---|
| `http://localhost:3000/` | DayBalance home page |
| `http://localhost:3000/api/health` | API health check |
| `http://localhost:3000/api/docs/` | Swagger UI |
| `http://localhost:3000/api/swagger.json` | OpenAPI JSON spec |
| `http://localhost:3000/db.html` | Database tools (reset/seed) |

### Project structure

```
daybalance/
├── index.html              ← Part 1 static pages (unchanged)
├── login.html
├── register.html
├── explore.html
├── ... (all Part 1 HTML pages)
├── db.html                 ← Database tools (now functional)
├── css/style.css
├── js/app.js
├── server/                 ← Server-side code
│   ├── index.js            ← Express entry point
│   ├── config/
│   │   ├── db.js            ← MongoDB connection logic
│   │   ├── env.js           ← Centralised env-var access
│   │   └── swagger.js       ← OpenAPI/Swagger spec config
│   ├── controllers/
│   │   ├── userController.js
│   │   ├── categoryController.js
│   │   ├── habitController.js
│   │   ├── completionController.js
│   │   ├── tipController.js
│   │   ├── activityController.js
│   │   └── dbController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Category.js
│   │   ├── Habit.js
│   │   ├── HabitCompletion.js
│   │   ├── HealthyTip.js
│   │   ├── ActivityHistory.js
│   │   └── index.js
│   ├── routes/
│   │   ├── index.js         ← API route mounting
│   │   ├── userRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── habitRoutes.js
│   │   ├── completionRoutes.js
│   │   ├── tipRoutes.js
│   │   ├── activityRoutes.js
│   │   └── dbRoutes.js
│   ├── middleware/
│   │   ├── notFound.js
│   │   ├── errorHandler.js
│   │   ├── validate.js      ← express-validator result checker
│   │   └── validators.js   ← Reusable validation rule chains
│   └── services/
│       ├── index.js
│       └── seedService.js  ← Database reset/seed logic
├── Dockerfile
├── docker-compose.yml
├── .env.example
└── package.json
```

### Mongoose models

Six models are defined with schema validation and cross-collection references:

| Model | Key fields | References |
|---|---|---|
| **User** | name, email, password, role (user/admin) | — |
| **Category** | name, description | — |
| **Habit** | name, description, timeOfDay, frequency, duration, difficulty, reminder, active | → Category, → User (owner) |
| **HabitCompletion** | date, completed | → Habit, → User |
| **HealthyTip** | title, content | → Category |
| **ActivityHistory** | action, targetType, targetId, date | → User |

Validation includes required fields, string length limits, email format matching, enums for role/timeOfDay/frequency/difficulty/targetType, numeric min/max for duration, and a unique compound index on HabitCompletion (user + habit + dayKey).

### Environment variables

Copy `.env.example` to `.env` and fill in the values:

| Variable | Description | Example |
|---|---|---|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/daybalance` |
| `PORT` | Port the Express server listens on | `3000` |
| `NODE_ENV` | Environment name | `development` |

For production, set `MONGODB_URI` to your cloud MongoDB (Atlas) connection string.

## Running locally (Node.js)

1. Make sure MongoDB is running locally on the default port (`27017`), or set `MONGODB_URI` to point to another instance.

2. Install dependencies:
   ```
   npm install
   ```

3. Copy the env file and adjust if needed:
   ```
   cp .env.example .env
   ```

4. Start the server:
   ```
   npm start
   ```

5. Open `http://localhost:3000` in your browser — you should see the DayBalance home page.

6. Check the API health endpoint: `http://localhost:3000/api/health`

## Running with Docker

1. Make sure Docker and Docker Compose are installed.

2. From the project root:
   ```
   docker compose up --build
   ```

   This starts two containers:
   - **app** — the Node/Express DayBalance application (port 3000)
   - **mongo** — a MongoDB 7 database (port 27017, data persisted in a named volume)

   The app container connects to MongoDB using `mongodb://mongo:27017/daybalance`.

3. Open `http://localhost:3000` in your browser.

4. To stop the containers:
   ```
   docker compose down
   ```

5. To stop and remove the MongoDB data volume:
   ```
   docker compose down -v
   ```
