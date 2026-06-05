# 🔧 COSMIS v3 — Fix Log & Setup Guide

## ✅ All known issues resolved in this zip

---

## Fresh Install (Windows PowerShell)

```powershell
# 1. Kill any old server instances first
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force

# 2. Navigate into project
cd cosmis-mern

# 3. Copy and edit env file
cp .env.example .env
notepad .env
# Set these three values:
#   MONGO_URI=mongodb://localhost:27017/cosmis_v3
#   JWT_SECRET=anyrandomstring123
#   ANTHROPIC_API_KEY=sk-ant-...

# 4. Install everything
npm run install:all

# 5. Start both servers
npm run dev
```

- **Backend** → http://localhost:5001
- **Frontend** → http://localhost:3000

---

## What was fixed

### Fix 1 — `EADDRINUSE: address already in use :::5000`
Your previous dev session left a Node process holding port 5000.
**Resolution:** Server now runs on port **5001** by default.
Alternatively kill the old process: `Get-Process node | Stop-Process -Force`

### Fix 2 — `Cannot find module 'ajv/dist/compile/codegen'`
A known bug with `react-scripts@5` + Node.js 18+.
The internal `ajv` version (v6) used by webpack is incompatible.
**Resolution:** Added `"ajv": "^8.12.0"` to `client/package.json` dependencies
so npm hoists the correct version into `node_modules/ajv`.

### Fix 3 — `react-scripts not recognized`
`cd client && npm start` doesn't work in PowerShell.
**Resolution:** All scripts now use `npm --prefix client` syntax.

### Fix 4 — Three.js peer conflict
`@react-three/fiber` required `three >= 0.133` but original was `0.128`.
**Resolution:** Removed `@react-three/fiber` and `@react-three/drei` entirely.
3D viewport uses vanilla `three@^0.160` directly — no peer conflict.

---

## If you still get the ajv error

Delete `client/node_modules` and reinstall:

```powershell
Remove-Item -Recurse -Force client\node_modules
npm install --prefix client --legacy-peer-deps
```

## MongoDB not running?

```powershell
# Check if MongoDB service exists
Get-Service -Name MongoDB -ErrorAction SilentlyContinue

# Start it
net start MongoDB

# Or use free MongoDB Atlas cloud:
# MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/cosmis_v3
```
