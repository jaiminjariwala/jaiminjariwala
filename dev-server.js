import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Import the tweets handler
import tweetsHandler from './api/tweets.js';

// Mock Vercel's req/res for local development
app.get('/api/tweets', async (req, res) => {
  // Create a Vercel-like response object
  const vercelRes = {
    status: (code) => {
      res.status(code);
      return vercelRes;
    },
    json: (data) => {
      res.json(data);
    },
    setHeader: (key, value) => {
      res.setHeader(key, value);
    }
  };

  await tweetsHandler(req, vercelRes);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`✅ API server running on http://localhost:${PORT}`);
  console.log(`📡 Tweets endpoint: http://localhost:${PORT}/api/tweets`);
});
