import postRepository from '../repositories/postRepository.js';
import auditRepository from '../repositories/auditRepository.js';
import pluginManager from './pluginManager.js';

class ContentService {
    async createPost(data) {
        // Business Logic: Kiểm tra tiêu đề có hợp lệ không
        if (!data.title || data.title.length < 5) {
            throw new Error("Tiêu đề bài viết quá ngắn!");
        }

        const postDraft = {
            title: data.title.trim(),
            content: (data.content || '').trim(),
            author: (data.author || 'anonymous').trim(),
            keyword: (data.keyword || '').trim()
        };

        pluginManager.runHook('onBeforeSave', { post: postDraft }, { auditRepository });

        // Gọi tầng Persistence để lưu
        console.log("Business Layer: Đang xử lý quy trình soạn thảo...");
        const savedPost = await postRepository.save(postDraft);

        pluginManager.runHook('onAfterSave', { post: savedPost }, { auditRepository });
        return savedPost;
    }

    async getPosts(actor = 'system') {
        pluginManager.runHook('onReadPosts', { actor }, { auditRepository });
        return postRepository.findAll();
    }

    async getAuditLogs(actor = 'system') {
        pluginManager.runHook('onReadAuditLogs', { actor }, { auditRepository });
        return auditRepository.findAll();
    }
}

export default new ContentService();    