import express from 'express';
import cors from 'cors';
import { createPost, getPosts, getAuditLogs } from './controllers/postController.js';

const app = express();
app.use(cors());
app.use(express.json());

// API Controllers thuộc Presentation Layer
app.post('/api/posts', createPost);
app.get('/api/posts', getPosts);
app.get('/api/audit-logs', getAuditLogs);

app.listen(3000, () => console.log("Layered CMS Backend running on port 3000"));