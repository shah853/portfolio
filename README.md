# Portfolio

A full-stack portfolio website with a public React frontend and an Express API for managing projects, skills, certificates, and contact messages.

## Tech stack

- **Client:** React 19, Vite, Tailwind CSS v4, React Router, Axios, Lucide React, Framer Motion
- **Server:** Node.js, Express 5, Mongoose 9, MongoDB Atlas, JWT authentication, Cloudinary uploads

## Local setup

### Requirements

- Node.js and npm
- A MongoDB database
- Cloudinary credentials for media uploads

### Server

1. Open a terminal in `server/`.
2. Install dependencies with `npm install`.
3. Copy `.env.example` to `.env` and fill in the server environment variables.
4. Start the API with `npm run dev` for development or `npm start` for a regular start.

The API listens on the configured `PORT` (5000 by default). The local Vite origin `http://localhost:5173` is always allowed by CORS.

### Client

1. Open a second terminal in `client/`.
2. Install dependencies with `npm install`.
3. Copy `.env.example` to `.env` if needed and set `VITE_API_URL` to the API base URL.
4. Start the frontend with `npm run dev`.

Vite runs locally at `http://localhost:5173`.

## Environment variables

### Server (`server/.env`)

| Variable | Purpose |
| --- | --- |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign and verify authentication tokens |
| `PORT` | Port used by the API server |
| `CLIENT_URL` | Allowed frontend origin(s); separate multiple origins with commas |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary account cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

### Client (`client/.env`)

| Variable | Purpose |
| --- | --- |
| `VITE_API_URL` | API base URL, including the `/api` path |

Do not commit `.env` files or put secrets in client-side variables.

## Deployment

### Render API

1. Create a new Web Service and connect the repository.
2. Set the service root directory to `server`.
3. Use `npm install` as the build command and `npm start` as the start command.
4. Add the server variables listed above in Render's environment settings. Set `CLIENT_URL` to the deployed Vercel frontend origin (or comma-separated origins).
5. Deploy and confirm the service's root endpoint responds.

### Vercel client

1. Create a Vercel project from the same repository.
2. Set the project root directory to `client`.
3. Use `npm run build` as the build command and `dist` as the output directory.
4. Add `VITE_API_URL` in Vercel's environment settings, using the deployed Render API URL with `/api` appended.
5. Deploy. `client/vercel.json` rewrites client-side routes to `index.html` for SPA routing.

