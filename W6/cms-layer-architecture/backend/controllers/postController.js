import contentService from '../services/contentService.js';

export const createPost = async (req, res) => {
    try {
        const post = await contentService.createPost(req.body);
        res.status(201).json(post);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getPosts = async (req, res) => {
    try {
        const posts = await contentService.getPosts(req.query.actor);
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getAuditLogs = async (req, res) => {
    try {
        const logs = await contentService.getAuditLogs(req.query.actor);
        res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};