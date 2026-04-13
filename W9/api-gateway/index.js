const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
app.use(cors());

// Bác bảo vệ phân luồng (Routing)
// Hễ Frontend gọi vào /api/users thì đẩy sang port 8081
app.use('/api/users', createProxyMiddleware({ 
    target: 'http://172.16.34.215:8081', 
    changeOrigin: true,
    pathRewrite: {'^/api/users': ''} // Xóa chữ /api/users trước khi gửi sang service thật
}));

// Gọi /api/movies thì đẩy sang port 8082
app.use('/api/movies', createProxyMiddleware({ 
    target: 'http://172.16.40.12:8082', 
    changeOrigin: true,
    pathRewrite: {'^/api/movies': ''}
}));

// Gọi /api/bookings thì đẩy sang port 8083
app.use('/api/bookings', createProxyMiddleware({ 
    target: 'http://172.16.40.0:8083', 
    changeOrigin: true,
    pathRewrite: {'^/api/bookings': ''}
}));
// Gọi /api/payment thì đẩy sang port 8084
app.use('/api/payment', createProxyMiddleware({ 
    target: 'http://172.16.40.0:8084', // Nhớ đổi thành IP mạng LAN tối nay
    changeOrigin: true,
    pathRewrite: {'^/api/payment': ''}
}));

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`🚀 API Gateway đang đứng gác tại port ${PORT}`);
});