// Giả lập DB (Database Layer)
const db = []; 

class PostRepository {
    async save(postData) {
        const newPost = {
            id: Date.now(),
            createdAt: new Date().toISOString(),
            ...postData
        };
        db.push(newPost);
        return newPost;
    }

    async findAll() {
        return [...db];
    }
}

export default new PostRepository();