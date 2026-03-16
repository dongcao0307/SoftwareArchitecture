import fs from 'fs';
import path from 'path';

export default class AuditPlugin {
    init(bus, options = {}) {
        const dataDir = options.dataDir || path.join(process.cwd(), 'data');
        const auditPath = path.join(dataDir, 'audit-log.json');

        const ensureAuditStore = () => {
            if (!fs.existsSync(dataDir)) {
                fs.mkdirSync(dataDir, { recursive: true });
            }
            if (!fs.existsSync(auditPath)) {
                fs.writeFileSync(auditPath, JSON.stringify([], null, 2), 'utf-8');
            }
        };

        const appendLog = (entry) => {
            ensureAuditStore();
            const logs = JSON.parse(fs.readFileSync(auditPath, 'utf-8'));
            logs.push(entry);
            fs.writeFileSync(auditPath, JSON.stringify(logs, null, 2), 'utf-8');
        };

        bus.on('audit:activity', (event) => {
            appendLog(event);
            console.log(`[Audit] ${event.actor} -> ${event.action}`);
        });

        bus.on('post:created', (post) => {
            const entry = {
                id: Date.now(),
                timestamp: new Date().toISOString(),
                action: 'post:created',
                actor: post.author || 'anonymous',
                details: {
                    postId: post.id,
                    title: post.title
                }
            };
            appendLog(entry);
            console.log(`[Audit] Nhật ký: ${entry.actor} vừa tạo bài viết ID ${post.id}`);
        });
    }
}