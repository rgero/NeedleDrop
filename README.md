# Needle Drop

![Needle Drop logo](./NeedleDrop/public/record-player.svg)

For my partner's birthday in 2025, I bought them a record player. What started as a fun new hobby quickly turned into a collection of nearly 300 records, and with that came a familiar problem: how do we remember what we own, what we want, where we bought things, and which albums we play the most?

Needle Drop is a personal vinyl collection tracker built to solve exactly that. It gives us a place to manage our records, track stores and locations, maintain a wantlist, log plays, and generate useful collection insights without wrestling with a generic marketplace platform.

This project is stored in the [NeedleDrop](./NeedleDrop) app folder and is designed as a fast, modern React app for vinyl enthusiasts who want more than a list of albums.

## Why this project exists

We could have used services like Discogs, but they don't naturally fit the way we think about our collection:

- tracking favorite record stores
- following the places where we found certain records
- keeping a living wantlist
- grouping plays and listening habits over time
- seeing collection stats that are meaningful to us

Needle Drop is built around those real-life needs rather than generic catalog tools.

## Features

- Vinyl collection tracking with record details and metadata
- Wantlist management for albums you want to buy
- Store and location tracking for favorite shops and pickups
- Play logging for listening history and repeat listening habits
- Collection insights and statistics, including performance summaries
- Clean, responsive UI using Material UI
- Real-time app state powered by React Query and Supabase
- Google Maps integration for location-aware tracking

## Tech stack

- React
- Vite
- TypeScript
- Material UI
- Supabase
- React Query
- TanStack Table
- Recharts
- React Router
- React Hot Toast
- Google Maps integration

## App overview

The app currently includes these main areas:

- Vinyls: manage the collection and individual record details
- Wantlist: track records you are hunting for
- Locations: save stores, spots, and collection-related places
- Plays: log listening sessions and track album play counts
- Stats: summarize collection value, habits, and record activity

## Running locally

From the repository root:

```bash
cd NeedleDrop
npm install
npm run dev
```

The app runs on the configured local port:

- http://localhost:3345

## Environment variables

This project expects a `.env` file in the app directory with the required values for Supabase and app configuration. A sample environment file is already present in the project as [.env](./NeedleDrop/.env), including values for:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_KEY`
- `VITE_GOOGLE_LOCATIONS_API`
- `VITE_REDIRECT_URL`
- `VITE_DATE_STARTED`

If you are setting up the project from scratch, make sure these values match your own Supabase and Google Cloud configuration before starting the app.

## Production build

```bash
cd NeedleDrop
npm run build
npm run preview
```

## Docker

This project also includes a container setup for deployment:

```bash
cd NeedleDrop
docker build -t needledrop .
```

A Docker Compose configuration is included as well for a hosted deployment setup. See [NeedleDrop/docker-compose.yml](./NeedleDrop/docker-compose.yml).

## Project structure

```text
NeedleDrop/
├── public/              # Static assets and app branding files
├── src/                 # React application source
├── tests/               # Automated tests
├── .env                 # Local runtime environment variables
├── Dockerfile           # Container build for deployment
├── docker-compose.yml   # Docker Compose deployment config
├── package.json         # Scripts and dependencies
├── vite.config.ts       # Vite configuration
├── vitest.config.ts     # Test configuration
├── index.html           # App entry point
└── README.md            # App-specific documentation
```

## Roadmap and future plans

The project is still evolving. A planning document in [Planning/Household Planning.md](./Planning/Household%20Planning.md) outlines future work around household and multi-user collection sharing, including shared household views and user profile visibility.

## Related project

This app has an accompanying Discord bot for vinyl-related automation and utilities:

- [VinylBot](https://github.com/rgero/VinylBot)

## Contributor note

This repo is a personal project, built around a specific use case: tracking and understanding a growing record collection with a bit of personality. It is actively evolving as the collection and ideas grow along with it.
