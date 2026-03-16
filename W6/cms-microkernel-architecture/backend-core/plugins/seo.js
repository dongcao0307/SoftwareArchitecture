export default class SEOPlugin {
    init(bus) {
        bus.on('post:beforeSave', (context) => {
            const { post } = context;
            const bodyText = `${post.title} ${post.content}`.toLowerCase();
            const words = bodyText.match(/[a-zA-Z0-9_\u00C0-\u1EF9]+/g) || [];
            const totalWords = words.length;

            const normalizedKeyword = (post.keyword || '').trim().toLowerCase();
            const keywordTokens = normalizedKeyword
                ? normalizedKeyword.match(/[a-zA-Z0-9_\u00C0-\u1EF9]+/g) || []
                : [];

            let keywordHits = 0;
            if (keywordTokens.length > 0) {
                for (let i = 0; i <= words.length - keywordTokens.length; i += 1) {
                    const segment = words.slice(i, i + keywordTokens.length);
                    if (segment.join(' ') === keywordTokens.join(' ')) {
                        keywordHits += 1;
                    }
                }
            }

            const density = totalWords === 0 ? 0 : Number(((keywordHits / totalWords) * 100).toFixed(2));
            const recommendation =
                density < 1
                    ? 'Mật độ từ khóa thấp, cân nhắc tăng tự nhiên trong nội dung.'
                    : density > 3
                        ? 'Mật độ từ khóa cao, cân nhắc giảm để tránh nhồi nhét.'
                        : 'Mật độ từ khóa nằm trong khoảng hợp lý (1% - 3%).';

            context.seo = {
                keyword: post.keyword || '',
                totalWords,
                keywordHits,
                density,
                recommendation
            };

            console.log(`[SEO] "${post.title}" | keyword="${post.keyword || '(none)'}" | density=${density}%`);
        });
    }
}