import express from 'express';
import cors from 'cors';
import { agentChatHandler } from './controllers/agentChat.js';
import { landingConfigHandler } from './controllers/landingConfig.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// API Routes
app.post('/api/agent-chat', agentChatHandler);
app.get('/api/v1/config/landing', landingConfigHandler);

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
