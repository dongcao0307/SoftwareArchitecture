const auditDb = [];

class AuditRepository {
    async save(entry) {
        const newEntry = {
            id: Date.now() + Math.floor(Math.random() * 1000),
            timestamp: new Date().toISOString(),
            ...entry
        };
        auditDb.push(newEntry);
        return newEntry;
    }

    async findAll() {
        return [...auditDb];
    }
}

export default new AuditRepository();