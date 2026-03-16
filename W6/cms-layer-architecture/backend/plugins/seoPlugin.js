class SEOPlugin {
    onBeforeSave({ post }) {
        const content = `${post.title} ${post.content}`.toLowerCase();
        const words = content.match(/[a-zA-Z0-9_\u00C0-\u1EF9]+/g) || [];
        const totalWords = words.length;

        const keyword = post.keyword.toLowerCase().trim();
        const keywordTokens = keyword ? keyword.match(/[a-zA-Z0-9_\u00C0-\u1EF9]+/g) || [] : [];

        let keywordHits = 0;
        if (keywordTokens.length > 0) {
            for (let i = 0; i <= words.length - keywordTokens.length; i += 1) {
                const segment = words.slice(i, i + keywordTokens.length).join(' ');
                if (segment === keywordTokens.join(' ')) {
                    keywordHits += 1;
                }
            }
        }

        const density = totalWords === 0 ? 0 : Number(((keywordHits / totalWords) * 100).toFixed(2));
        const recommendation =
            density < 1
                ? 'Mật độ từ khóa thấp, nên thêm từ khóa tự nhiên.'
                : density > 3
                    ? 'Mật độ từ khóa cao, nên giảm để tránh nhồi nhét.'
                    : 'Mật độ từ khóa tốt (1% - 3%).';

        post.seo = {
            keyword: post.keyword,
            totalWords,
            keywordHits,
            density,
            recommendation
        };
    }
}

export default new SEOPlugin();