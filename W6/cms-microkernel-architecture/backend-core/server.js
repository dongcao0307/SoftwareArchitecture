import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import EventEmitter from 'events';

const app = express();
app.use(cors());
app.use(express.json());

// --- 1. HOOK / EVENT-BUS ---
const bus = new EventEmitter();

const dataDir = path.join(process.cwd(), 'data');
const postsFile = path.join(dataDir, 'posts.json');

const ensureDataStore = () => {
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }
    if (!fs.existsSync(postsFile)) {
        fs.writeFileSync(postsFile, JSON.stringify([], null, 2), 'utf-8');
    }
};

const readPosts = () => {
    ensureDataStore();
    const raw = fs.readFileSync(postsFile, 'utf-8');
    return JSON.parse(raw);
};

const writePosts = (posts) => {
    ensureDataStore();
    fs.writeFileSync(postsFile, JSON.stringify(posts, null, 2), 'utf-8');
};

const publishActivity = (action, actor, details = {}) => {
    bus.emit('audit:activity', {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        action,
        actor: actor || 'anonymous',
        details
    });
};

// --- 2. PLUGIN MANAGER (Dynamic Loader) ---
const loadPlugins = async () => {
    const pluginsDir = path.join(process.cwd(), 'plugins');
    const files = fs.readdirSync(pluginsDir);

    for (const file of files) {
        if (file.endsWith('.js')) {
            const { default: PluginClass } = await import(`file://${path.join(pluginsDir, file)}`);
            const instance = new PluginClass();
            instance.init(bus, { dataDir });
            console.log(`[System] Loaded plugin: ${file}`);
        }
    }
};

// --- 3. CORE SERVICE (Content Service) ---
app.post('/api/posts', (req, res) => {
    try {
        const { title = '', content = '', author = 'anonymous', keyword = '' } = req.body;
        if (!title.trim()) {
            return res.status(400).json({ message: 'Title is required.' });
        }

        console.log('Core: Đang lưu bài viết...');

        const post = {
            id: Date.now(),
            title: title.trim(),
            content: content.trim(),
            author: author.trim() || 'anonymous',
            keyword: keyword.trim(),
            createdAt: new Date().toISOString()
        };

        const saveContext = { post, seo: null };
        bus.emit('post:beforeSave', saveContext);

        const posts = readPosts();
        posts.push({ ...post, seo: saveContext.seo });
        writePosts(posts);

        bus.emit('post:created', { ...post, seo: saveContext.seo });
        publishActivity('post:create', post.author, { postId: post.id, title: post.title });

        return res.json({
            message: 'Post saved!',
            post: { ...post, seo: saveContext.seo }
        });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to save post.', error: error.message });
    }
});

app.get('/api/posts', (req, res) => {
    try {
        const posts = readPosts();
        publishActivity('post:list', req.query.actor || 'system', { total: posts.length });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Failed to load posts.', error: error.message });
    }
});

app.get('/api/audit-logs', (req, res) => {
    try {
        const auditPath = path.join(dataDir, 'audit-log.json');
        if (!fs.existsSync(auditPath)) {
            return res.json([]);
        }
        const logs = JSON.parse(fs.readFileSync(auditPath, 'utf-8'));
        publishActivity('audit:list', req.query.actor || 'system', { total: logs.length });
        return res.json(logs);
    } catch (error) {
        return res.status(500).json({ message: 'Failed to load audit logs.', error: error.message });
    }
});

loadPlugins().then(() => {
    ensureDataStore();
    app.listen(3000, () => console.log("Backend Core running on port 3000"));
});