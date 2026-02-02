const axios = require('axios');

async function test() {
    console.log("=== BẮT ĐẦU KIỂM THỬ HỆ THỐNG ===");
    for (let i = 1; i <= 15; i++) {
        try {
            const start = Date.now();
            const res = await axios.get('http://localhost:3000/fetch');
            const time = Date.now() - start;
            console.log(`Lần ${i}: [${res.status}] - ${res.data} (${time}ms)`);
        } catch (err) {
            console.log(`Lần ${i}: [${err.response?.status || 'ERR'}] - ${err.response?.data || err.message}`);
        }
        // Nghỉ 200ms giữa các lần gọi để dễ quan sát
        await new Promise(r => setTimeout(r, 200));
    }
}

test();
async function testBulkhead() {
    console.log("=== KIỂM THỬ BULKHEAD (GỬI ĐỒNG THỜI 10 REQUEST) ===");
    
    // Gửi 10 request cùng lúc, không đợi nhau
    const requests = Array.from({ length: 10 }, (_, i) => axios.get('http://localhost:3000/fetch'));

    const results = await Promise.allSettled(requests);
    
    results.forEach((res, i) => {
        console.log(`Lần ${i+1}: ${res.status === 'fulfilled' ? 'Thành công' : 'Thất bại'}`);
    });
}
testBulkhead();