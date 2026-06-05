const express = require('express');
const router = express.Router();

// POST /api/ai/chat  — proxy to Anthropic, keeps API key server-side
router.post('/chat', async (req, res) => {
  try {
    const { messages, system, max_tokens = 1400, tools } = req.body;
    if (!messages || !Array.isArray(messages)) return res.status(400).json({ error: 'messages array required' });

    const body = {
      model: 'claude-sonnet-4-20250514',
      max_tokens,
      messages,
      ...(system && { system }),
      ...(tools && { tools }),
    };

    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(body),
    });

    if (!upstream.ok) {
      const err = await upstream.text();
      return res.status(upstream.status).json({ error: err });
    }

    const data = await upstream.json();
    res.json(data);
  } catch (err) {
    console.error('AI proxy error:', err);
    res.status(500).json({ error: 'AI service unavailable' });
  }
});

// POST /api/ai/analyze  — Mission analysis with structured JSON output
router.post('/analyze', async (req, res) => {
  try {
    const { missionParams, components } = req.body;
    const prompt = `You are an aerospace systems engineer. Analyze this space mission and return ONLY valid JSON (no markdown):
Mission: ${missionParams.type}, Launcher: ${missionParams.launcher}, Payload: ${missionParams.mass}kg, 
Orbit/Dest: ${missionParams.alt}km, Duration: ${missionParams.dur}yr, Power: ${missionParams.power}, 
Propulsion: ${missionParams.prop}, Shielding: ${missionParams.shield}, Inclination: ${missionParams.incl}°
Components: ${(components || []).join(', ')}

Return exact JSON: {"successRate":<0-100>,"verdict":"<MISSION VIABLE|MARGINAL RISK|HIGH RISK|CRITICAL FAILURE>","confidence":"<HIGH|MEDIUM|LOW>","overallGrade":"<A+|A|B+|B|C|D|F>","subsystems":{"launch":{"score":<0-100>,"status":"<PASS|WARN|FAIL>","note":"<brief>"},"power":{"score":<0-100>,"status":"<PASS|WARN|FAIL>","note":"<brief>"},"propulsion":{"score":<0-100>,"status":"<PASS|WARN|FAIL>","note":"<brief>"},"thermal":{"score":<0-100>,"status":"<PASS|WARN|FAIL>","note":"<brief>"},"radiation":{"score":<0-100>,"status":"<PASS|WARN|FAIL>","note":"<brief>"},"communications":{"score":<0-100>,"status":"<PASS|WARN|FAIL>","note":"<brief>"},"structure":{"score":<0-100>,"status":"<PASS|WARN|FAIL>","note":"<brief>"}},"risks":[{"level":"<HIGH|MEDIUM|LOW>","system":"<n>","message":"<specific>"}],"suggestions":["<improvement 1>","<improvement 2>","<improvement 3>"],"telemetry":{"deltaV":"<m/s>","transferTime":"<time>","commDelay":"<time>","power":"<watts>","thermal":"<range>","fuelMass":"<kg>"},"similarMissions":["<real mission 1>","<real mission 2>"]}`;

    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 1400, messages: [{ role: 'user', content: prompt }] }),
    });

    if (!upstream.ok) throw new Error('Upstream failed');
    const data = await upstream.json();
    const result = JSON.parse(data.content[0].text.replace(/```json|```/g, '').trim());
    res.json(result);
  } catch {
    res.status(500).json({ error: 'Analysis failed' });
  }
});

// POST /api/ai/cosmic  — Cosmic object search
router.post('/cosmic', async (req, res) => {
  try {
    const { query } = req.body;
    const prompt = `You are COSMIS, an expert astronomy AI. The user searched for: "${query}". 
Return ONLY a compact JSON object with these exact fields:
{"name":"<full name>","type":"<PLANET|STAR|GALAXY|BLACK HOLE|NEBULA|EXOPLANET|etc>","subtitle":"<one-line tagline>",
"stats":{"<key1>":"<val1>","<key2>":"<val2>","<key3>":"<val3>","<key4>":"<val4>","<key5>":"<val5>","<key6>":"<val6>"},"desc":"<2-3 sentence description>","funFact":"<one mind-blowing fact>","renderType":"<planet|star|galaxy|black_hole|neutron_star|supernova|exoplanet|deep_field|milky_way|saturn>","color":"<hex color>"}`;

    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 600, messages: [{ role: 'user', content: prompt }] }),
    });

    if (!upstream.ok) throw new Error('Upstream failed');
    const data = await upstream.json();
    const result = JSON.parse(data.content[0].text.replace(/```json|```/g, '').trim());
    res.json(result);
  } catch {
    res.status(500).json({ error: 'Cosmic search failed' });
  }
});

module.exports = router;
