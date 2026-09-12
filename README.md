# DayBalance

DayBalance is a healthy daily habit planner designed to help people organize small routines, complete habits, and understand their consistency.

## Part 1: static prototype

This repository contains the visual prototype for Part 1 of the university web programming project. All pages are static HTML with shared CSS and a small amount of vanilla JavaScript for the mobile navigation toggle and confirmation modals.

There is no backend, database, authentication, REST API, JWT, or external API integration yet. The buttons, forms, filters, and database controls are visual only and do not perform real operations. Those features will be added in later parts of the project.

## Project structure

```
daybalance-part1/
├── index.html
├── login.html
├── register.html
├── explore.html
├── habit-details.html
├── dashboard.html
├── habits.html
├── add-habit.html
├── edit-habit.html
├── habit-details-user.html
├── progress.html
├── tips.html
├── weather.html
├── admin.html
├── users.html
├── categories.html
├── manage-tips.html
├── db.html
├── css/
│   └── style.css
└── js/
    └── app.js
```

## Screens

- `index.html` — landing page with a daily planner preview and feature highlights
- `login.html` — static login screen with example validation messaging
- `register.html` — static registration screen with example validation messaging
- `explore.html` — public habit library with search and filter controls
- `habit-details.html` — public detailed view of a single habit
- `dashboard.html` — personal dashboard with daily progress, habits by time of day, sample weather, and weekly preview
- `habits.html` — personal habit list with search, filters, and table actions
- `add-habit.html` — static form to add a new habit
- `edit-habit.html` — static form to edit an existing habit, pre-filled with sample data
- `habit-details-user.html` — personal habit detail view with streak and completion history
- `progress.html` — weekly statistics page with a static bar chart and category summary
- `tips.html` — searchable and filterable collection of healthy lifestyle tips
- `weather.html` — static daily conditions screen for future external API integration
- `admin.html` — administrator dashboard with totals, recent activity, and popular categories
- `users.html` — admin user management table with search and filters
- `categories.html` — admin category management list
- `manage-tips.html` — admin tip management table
- `db.html` — technical page with visual Reset Database and Seed Initial Data controls and a confirmation modal

## Opening locally

Open `index.html` directly in a browser, or serve the folder with any simple local static file server and use the navigation links to move between screens.
