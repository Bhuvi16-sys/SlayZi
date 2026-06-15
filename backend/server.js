import express from 'express';
import cors from 'cors';
import { agentChatHandler } from './controllers/agentChat.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// API Routes
app.post('/api/agent-chat', agentChatHandler);

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
