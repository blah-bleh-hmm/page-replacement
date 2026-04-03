# Page Replacement Simulator (MERN)

Interactive MERN application to simulate and compare multiple page replacement algorithms with step-by-step visualizations and history.

## Features

- Algorithms: Basic (random), FIFO, Optimal, LRU, LRU Approximation (aging), Second Chance (clock-style), Counting-Based (LFU with LRU tie-breaker).
- Run single or multiple algorithms on the same input and compare faults, hits, and hit ratio side-by-side.
- Step-by-step frame evolution with hit/fault markers and replaced pages.
- History stored in MongoDB with in-memory fallback when MongoDB is unavailable.

## Getting started

1. **Run both apps with concurrently (recommended for dev)**

- `npm install`
- Copy `.env.example` to `.env` and set backend + frontend values (e.g., `MONGO_URI`, `VITE_API_BASE_URL`).
- Copy `backend/.env.example` to `backend/.env` if you want a backend-only env file.
- `npm run dev`
- Backend runs on 5000; frontend on 5173 with `/api` proxy.

2. **Backend only**

- `cd backend`
- `npm install`
- Copy `.env.example` to `.env` and set `MONGO_URI`.
- `npm run dev` (or `npm start` for production).

3. **Frontend only**

- `cd frontend`
- `npm install`
- `npm run dev`

Vite dev server runs on 5173 and proxies `/api` to the Express backend (5000 by default).

## API

- `GET /api/health` — health check.
- `GET /api/simulations/algorithms` — list available algorithms.
- `POST /api/simulations/run` — run one or many algorithms.
  ```json
  {
    "frameSize": 3,
    "pages": [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2],
    "algorithms": ["fifo", "optimal", "lru"],
    "save": true
  }
  ```
  Response: `{ runs: [{ key, algorithm, steps, summary }], saved: boolean }`.
- `GET /api/simulations/history` — latest simulations (MongoDB if connected, otherwise in-memory).

### Response schemas

- Algorithms
  ```json
  {
    "algorithms": [
      { "key": "fifo", "label": "First-In First-Out" },
      { "key": "optimal", "label": "Optimal" },
      { "key": "lru", "label": "Least Recently Used" },
      { "key": "lruApproximation", "label": "LRU Approximation (Aging)" },
      { "key": "secondChance", "label": "Second Chance" },
      { "key": "countingBased", "label": "Counting-Based (LFU + LRU)" },
      { "key": "basicRandom", "label": "Basic Random" }
    ]
  }
  ```
- Run simulation
  ```json
  {
    "runs": [
      {
        "key": "fifo",
        "algorithm": "First-In First-Out",
        "steps": [
          { "index": 0, "page": 7, "frames": [7], "hit": false, "fault": true },
          {
            "index": 1,
            "page": 0,
            "frames": [7, 0],
            "hit": false,
            "fault": true
          },
          {
            "index": 2,
            "page": 1,
            "frames": [7, 0, 1],
            "hit": false,
            "fault": true
          },
          {
            "index": 3,
            "page": 2,
            "frames": [2, 0, 1],
            "hit": false,
            "fault": true,
            "replaced": 7
          }
        ],
        "summary": { "faults": 4, "hits": 0, "hitRatio": 0 }
      }
    ],
    "saved": true
  }
  ```

  - Each `step` includes `frames` as they looked after the access, `hit`/`fault` flags, and optional `replaced` when an eviction occurred.
- History
  ```json
  {
    "items": [
      {
        "frameSize": 3,
        "pages": [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2],
        "algorithms": ["fifo", "optimal"],
        "runs": [
          /* same shape as run response */
        ],
        "createdAt": "2024-12-05T17:12:03.842Z"
      }
    ]
  }
  ```
- Error examples
  - Frame size over the safety guard: `{ "message": "Frame size exceeds supported maximum (5000). Reduce frame size to continue." }`
  - Too many duplicate pages (>90%): `{ "message": "Reference string contains too many duplicate pages (90% duplicates). Reduce repetition to continue." }`

## Algorithm complexity

Let $n$ be the length of the reference string and $f$ the frame size.

- Basic Random — time $O(n\,f)$ (linear scan + includes), space $O(f)$.
- FIFO — time $O(n\,f)$, space $O(f)$; pointer gives $O(1)$ eviction after each scan.
- Optimal — time $O(n^2)$ in practice ($f$ look-ahead scans per fault), space $O(f)$.
- LRU — time $O(n\,f)$ (frame scan to find the oldest), space $O(f)$ for `lastUsed`.
- LRU Approximation (Aging) — time $O(n\,f)$ (counter shifts + min search), space $O(f)$ for counters.
- Second Chance — time $O(n\,f)$ worst case when every page gets a second pass, space $O(f)$.
- Counting-Based (LFU + LRU tie-breaker) — time $O(n\,f)$, space $O(f)$ for counts/recent maps.

## Frontend usage

- Provide frame size, optional number of pages, and a space/comma-separated reference string.
- Select algorithms (or "Select all").
- Click **Run Simulation** to view comparison and per-step frames. **Load Dummy Data** fills common sample inputs quickly.

## Environment

- Node 18+
- MongoDB (local or Atlas) for persistent history. Set `ALLOW_SAVE_HISTORY=false` to skip persistence.

### Environment variables

| Variable           | Scope    | Default                                      | Purpose                                                                                                         |
| ------------------ | -------- | -------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| PORT               | Backend  | 5000                                         | Express listen port.                                                                                            |
| MONGO_URI          | Backend  | mongodb://localhost:27017/page_replacement   | MongoDB connection string.                                                                                      |
| ALLOW_SAVE_HISTORY | Backend  | true                                         | Disable to skip DB writes (history remains in-memory).                                                          |
| VITE_API_BASE_URL  | Frontend | `http://localhost:5000` (see `.env.example`) | Absolute API base. Leave empty during dev to use Vite's `/api` proxy; set to the backend origin for production. |

## Setup troubleshooting

- Dev servers not starting: ensure ports 5000 (backend) and 5173 (frontend) are free or override with `PORT` / `npm run dev -- --port`.
- API calls failing in the UI: verify `VITE_API_BASE_URL` matches the running backend (or leave empty to rely on the dev proxy).
- MongoDB unreachable: start Mongo locally/Atlas, or set `ALLOW_SAVE_HISTORY=false` to use in-memory history while developing.
- Requests rejected for input size/repetition: lower `frameSize` (must be ≤ 5000) or reduce repeated pages so duplicates stay under 90%.
- Cache/config drift: re-copy `.env.example` to `.env` (root and/or backend) and restart both servers.

## Project structure

- `backend/`: Express API, algorithms, MongoDB model.
- `frontend/`: React + Vite UI.
- `.github/copilot-instructions.md`: workspace automation checklist.

## Testing

- Backend: `npm --prefix backend test`
- Frontend: `npm --prefix frontend test`

## Performance notes

- `StepsViewer` paginates step-by-step output by default so long (1000+) reference strings stay responsive.
