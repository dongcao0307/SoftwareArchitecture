const express = require('express');
const axios = require('axios');
const CircuitBreaker = require('opossum');
const rateLimit = require('express-rate-limit');

const app = express();

// --- 1. RATE LIMITER: Giới hạn 5 yêu cầu/phút mỗi IP ---
const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    message: "🚫 Gateway: Quá tải! Vui lòng thử lại sau 1 phút."
});
app.use(limiter);

// --- 2. BULKHEAD: Chỉ cho phép 2 yêu cầu xử lý đồng thời ---
let bulkhead;
(async () => {
    const pLimit = await import('p-limit');
    bulkhead = pLimit.default(2);
})();

// --- 3. CIRCUIT BREAKER: Cầu chì tự ngắt ---
const options = {
    timeout: 5000, 
    errorThresholdPercentage: 50, // Lỗi > 50% thì ngắt mạch
    resetTimeout: 10000 // Thử kết nối lại sau 10 giây
};
const breaker = new CircuitBreaker(async () => {
    return await axios.get('http://localhost:5000/api/resource');
}, options);

breaker.fallback(() => "⚠️ Gateway: Dịch vụ đích đang hỏng, tôi trả về dữ liệu dự phòng.");

// --- 4. RETRY: Tự động thử lại 3 lần ---
// ... (các phần khai báo giữ nguyên)

async function fetchWithRetry(retries = 3) {
    try {
        // Bulkhead sẽ chặn ở đây nếu > 2 request đang xử lý
        return await bulkhead(async () => {
            console.log("📥 Gateway: Đang đẩy request vào khoang xử lý...");
            return await breaker.fire();
        });
    } catch (err) {
        // Kiểm tra nếu lỗi là do Target trả về 500
        if (retries > 0) {
            console.log(`🔄 [RETRY] Target lỗi. Đang thử lại... (Còn ${retries} lần)`);
            return await fetchWithRetry(retries - 1);
        }
        throw err; // Hết lượt retry thì mới báo lỗi
    }
}

app.get('/fetch', async (req, res) => {
    try {
        const result = await fetchWithRetry();
        res.send(result.data || result);
    } catch (error) {
        res.status(503).send("💔 Hệ thống không phản hồi.");
    }
});

app.listen(3000, () => console.log('🚀 Gateway Service: http://localhost:3000'));