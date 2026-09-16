# DayBalance

DayBalance is a healthy daily habit planner designed to help people organize small routines, complete habits, and understand their consistency.

## Part 1: static prototype

The visual prototype consists of static HTML pages with shared CSS and a small amount of vanilla JavaScript for the mobile navigation toggle and confirmation modals. All Part 1 pages continue to work exactly as before — Express now serves them as static files.

## Part 2: Express + MongoDB + MVC foundation

Part 2 adds a Node.js/Express server with an MVC-style structure and a MongoDB (Mongoose) data layer. There is no server-side rendered view engine — the existing static HTML frontend is served directly by Express, and a future part will replace it with a React SPA.

### Project structure

```
daybalance/
├── index.html              ← Part 1 static pages (unchanged)
├── login.html
├── register.html
├── explore.html
├── ... (all Part 1 HTML pages)
├── css/style.css
├── js/app.js
├── server/                 ← Part 2 server-side code
│   ├── index.js            ← Express entry point
│   ├── config/
│   │   ├── db.js           ← MongoDB connection logic
│   │   └── env.js          ← Centralised env-var access
│   ├── controllers/        ← Route handler logic (placeholder for later parts)
│   ├── models/              ← Mongoose models
│   │   ├── User.js
│   │   ├── Category.js
│   │   ├── Habit.js
│   │   ├── HabitCompletion.js
│   │   ├── HealthyTip.js
│   │   ├── ActivityHistory.js
│   │   └── index.js
│   ├── routes/
│   │   └── index.js        ← API route mounting (health check for now)
│   ├── middleware/
│   │   ├── notFound.js
│   │   └── errorHandler.js
│   └── services/           ← Business logic layer (placeholder for later parts)
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

Validation includes required fields, string length limits, email format matching, enums for role/timeOfDay/frequency/difficulty/targetType, numeric min/max for duration, and a unique compound index on HabitCompletion (habit + user + date).

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
