class AuditLogPlugin {
    async onAfterSave({ post }, { auditRepository }) {
        await auditRepository.save({
            actor: post.author || 'anonymous',
            action: 'post:create',
            details: {
                postId: post.id,
                title: post.title
            }
        });
    }

    async onReadPosts({ actor }, { auditRepository }) {
        await auditRepository.save({
            actor,
            action: 'post:list',
            details: {
                message: 'Xem danh sách bài viết'
            }
        });
    }

    async onReadAuditLogs({ actor }, { auditRepository }) {
        await auditRepository.save({
            actor,
            action: 'audit:list',
            details: {
                message: 'Xem nhật ký hệ thống'
            }
        });
    }
}

export default new AuditLogPlugin();