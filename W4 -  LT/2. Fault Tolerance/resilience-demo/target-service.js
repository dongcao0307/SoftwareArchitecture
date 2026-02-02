const express = require('express');
const app = express();

app.get('/api/resource', (req, res) => {
    const random = Math.random();

    // Giả lập lỗi 500 (30% tỉ lệ) để test Retry    
    if (random < 0.3) {
        console.log("❌ Target: Xảy ra lỗi 500!");
        return res.status(500).send("Target Error");
    }

    // Giả lập xử lý chậm (3 giây - 20% tỉ lệ) để test Circuit Breaker/Bulkhead
    if (random > 0.8) {
        console.log("⏳ Target: Xử lý rất chậm...");
        return setTimeout(() => res.send("Dữ liệu chậm"), 3000);
    }

    console.log("✅ Target: Trả về dữ liệu thành công");
    res.send("Dữ liệu từ Target");
});

app.listen(5000, () => console.log('🎯 Target Service: http://localhost:5000'));