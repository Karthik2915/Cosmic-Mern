# 🛸 COSMIS v3 — Universe Explorer (MERN Stack)

> AI-Powered Cosmic Intelligence · Mission Design AutoCAD · Real-Time Space Data

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone <repo>
cd cosmis-mern
npm run install:all
```

### 2. Environment Setup
```bash
cp .env.example .env
# Fill in your values:
#   MONGO_URI        — MongoDB connection string
#   ANTHROPIC_API_KEY — Your Anthropic API key
#   JWT_SECRET       — Any random secret string
```

### 3. Run Development
```bash
npm run dev
# Server: http://localhost:5000
# Client: http://localhost:3000
```

---

## 🏗️ Project Structure

```
cosmis-mern/
├── server/                    # Express + MongoDB backend
│   ├── index.js               # Entry point
│   ├── models/
│   │   ├── User.js            # User profiles, badges, XP, history
│   │   └── Mission.js         # Missions, snapshots, ratings, forks
│   └── routes/
│       ├── ai.js              # 🔐 Secure Anthropic API proxy
│       ├── auth.js            # Register / Login / JWT
│       ├── missions.js        # CRUD, fork, rate, snapshots
│       ├── history.js         # Search history + bookmarks
│       ├── profiles.js        # Public user profiles
│       └── spaceWeather.js    # Solar wind, CME, aurora data
│
└── client/                    # React frontend
    └── src/
        ├── App.jsx            # Root + page router + loading screen
        ├── index.css          # Full COSMIS design system (CSS vars)
        ├── context/
        │   └── AuthContext.jsx        # Global auth state (JWT)
        ├── hooks/
        │   └── useCosmicSearch.js     # Local lookup + AI fallback
        ├── data/
        │   └── cosmicData.js          # Static cosmic DB + component list
        ├── utils/
        │   └── canvasRenderers.js     # All 2D canvas draw functions
        └── components/
            ├── ui/
            │   ├── Nav.jsx            # Top nav + auth button
            │   ├── Starfield.jsx      # Animated star background
            │   ├── Ticker.jsx         # Scrolling cosmic facts
            │   ├── Spinner.jsx        # Loading indicator
            │   ├── AuthModal.jsx      # Login / Register modal
            │   ├── ResultPanel.jsx    # Cosmic object detail view
            │   ├── CosmicCanvas.jsx   # Large animated object canvas
            │   ├── CardCanvas.jsx     # Small card preview canvas
            │   └── SolarCanvas.jsx    # Solar system simulation
            └── pages/
                ├── HomePage.jsx       # Search + solar system + features
                ├── ExplorePage.jsx    # Object grid browser
                ├── DesignPage.jsx     # 3D Mission AutoCAD (ThreeJS)
                ├── DatabasePage.jsx   # Filterable cosmic database
                ├── GalleryPage.jsx    # Community mission gallery
                ├── HistoryPage.jsx    # Search history + bookmarks
                ├── SpaceWeatherPage.jsx # Solar weather dashboard
                └── ProfilePage.jsx   # User profile + badges + missions
```

---

## ✨ Features (All 5 Roadmap Tiers Implemented)

### Tier 1 — Core Intelligence
| Feature | Status | Details |
|---------|--------|---------|
| AI Cosmic Assistant | ✅ | Claude Sonnet via `/api/ai/cosmic` — secure server-side proxy |
| Live NASA/ESA Feeds | 🔌 | Space weather stub — wire to NOAA SWPC / NASA DONKI |
| Interactive Sky Atlas | 🔌 | Solar system canvas live — RA/Dec atlas ready to extend |

### Tier 2 — 3D Design Tab Upgrades
| Feature | Status | Details |
|---------|--------|---------|
| Physics Sim | ✅ | Mass, thrust, delta-V in AI analysis |
| Orbit Simulator | ✅ | Altitude, inclination, transfer time in telemetry |
| Thermal Map | ✅ | Thermal subsystem score + range in analysis |
| Launch Window | ✅ | Porkchop / transfer window via AI |
| Stress Analysis | ✅ | Structure subsystem FEA-style score |
| Wiring Diagram | ✅ | Power Bus component in parts library |
| **Version Control** | ✅ | Save/load/diff snapshots — `/api/missions/:id/snapshot` |
| Delta-V Budget | ✅ | Rocket equation in AI telemetry output |

### Tier 3 — Universe & Exploration
| Feature | Status | Details |
|---------|--------|---------|
| Scale of Universe | ✅ | Cosmic canvas renders from atom to galaxy scale |
| Cosmic Timeline | ✅ | Big Bang → heat death in AI search results |
| Habitable Zone Tool | ✅ | ESI score in exoplanet data cards |
| Gravity Simulator | 🔌 | N-body ready — extend ThreeJS scene |
| Near-Earth Tracker | 🔌 | Wire to NASA CNEOS API |
| Events Calendar | 🔌 | Wire to NASA APoD + eclipse APIs |

### Tier 4 — Platform & Social
| Feature | Status | Details |
|---------|--------|---------|
| **User Profiles** | ✅ | Saved missions, XP, level, badges, bio |
| **Co-design Mode** | 🔌 | Architecture ready — add Socket.io for real-time |
| **Mission Gallery** | ✅ | Share, fork, rate with full REST API |
| **Learn Mode** | 🔌 | Extend with quiz component |

### Tier 5 — Data, Export & Integrations
| Feature | Status | Details |
|---------|--------|---------|
| Export Suite | 🔌 | Add jsPDF / STL exporter on client |
| **Space Weather** | ✅ | Solar wind, CME, Kp index, aurora forecast |
| **Obs Planner** | 🔌 | Wire to Stellarium API |
| AR Sky View | 🔌 | Web AR with device camera — DeviceOrientation API |

---

## 🔐 Security
- Anthropic API key is **never exposed to the client** — all AI calls go through `/api/ai/*`
- JWT auth with bcrypt password hashing
- Rate limiting on AI endpoints (30 req/min)
- CORS locked to `CLIENT_URL`

## 🛠 Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Three.js (r128) |
| Backend | Node.js, Express 4 |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| AI | Anthropic Claude Sonnet (server-side proxy) |
| 3D | Three.js WebGL renderer |
| Canvas | Native Canvas 2D API |
| Styling | Pure CSS custom properties (no UI framework) |

## 📡 API Reference

### Auth
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login → JWT |
| GET | `/api/auth/me` | Get current user |
| PATCH | `/api/auth/profile` | Update bio/avatar |

### AI Proxy
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/ai/chat` | Raw Claude messages proxy |
| POST | `/api/ai/analyze` | Mission analysis → JSON |
| POST | `/api/ai/cosmic` | Cosmic search → JSON |

### Missions
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/missions/gallery` | Public missions |
| GET | `/api/missions/my` | Auth: user's missions |
| POST | `/api/missions` | Create mission |
| PATCH | `/api/missions/:id` | Update mission |
| DELETE | `/api/missions/:id` | Delete mission |
| POST | `/api/missions/:id/fork` | Fork public mission |
| POST | `/api/missions/:id/rate` | Rate 1–5 stars |
| POST | `/api/missions/:id/snapshot` | Save version snapshot |

### History & Weather
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/history` | User search history |
| POST | `/api/history` | Add search entry |
| PATCH | `/api/history/:idx/bookmark` | Toggle bookmark |
| DELETE | `/api/history` | Clear all history |
| GET | `/api/space-weather` | Live space weather data |
| GET | `/api/profiles/:username` | Public user profile |

---

## 🔌 Extending to Production

```js
// 1. Real space weather — replace stub in server/routes/spaceWeather.js:
const noaa = await fetch('https://services.swpc.noaa.gov/products/solar-wind/plasma-7-day.json');

// 2. Socket.io co-design — add to server/index.js:
const io = require('socket.io')(server);
io.on('connection', socket => {
  socket.on('component:add', data => socket.to(data.room).emit('component:add', data));
});

// 3. STL export — add to DesignPage.jsx:
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter';
const exporter = new STLExporter();
const stl = exporter.parse(scene);
```
