const express = require('express');
const router = express.Router();

// GET /api/space-weather — aggregated space weather data
// In production, proxy to NOAA SWPC, NASA DONKI, etc.
router.get('/', async (req, res) => {
  try {
    // Stub data — replace with real NOAA/NASA API calls in production
    res.json({
      solarWind: { speed: 420 + Math.floor(Math.random() * 180), density: (3.5 + Math.random() * 4).toFixed(1), temperature: (1.2e5 + Math.random() * 8e4).toExponential(2) },
      kpIndex: (1 + Math.random() * 7).toFixed(1),
      xrayFlux: `C${(1 + Math.random() * 4).toFixed(1)}`,
      geomagneticStorm: Math.random() > 0.75 ? 'G1 WATCH' : 'QUIET',
      cme: Math.random() > 0.85 ? { speed: `${800 + Math.floor(Math.random() * 600)} km/s`, arrival: '36–48 hrs' } : null,
      auroraForecast: { north: Math.floor(40 + Math.random() * 30), south: Math.floor(50 + Math.random() * 25) },
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
