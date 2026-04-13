require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectRabbitMQ, publishEvent } = require('./rabbitmq');

const app = express();
app.use(express.json());
app.use(cors());

app.post('/register', async (req, res) => {
    const { username, email } = req.body;
    
    // Giả lập lưu vào Database...
    const newUser = { id: Math.floor(Math.random() * 1000), username, email };
    
    // Publish Event
    await publishEvent('movie_exchange', 'USER_REGISTERED', newUser);
    
    res.status(201).json({ message: "Đăng ký thành công!", user: newUser });
});

// Thêm API Đăng nhập
app.post('/login', (req, res) => {
    const { username } = req.body;
    // Giả lập login thành công luôn
    const mockUser = { id: `U${Math.floor(Math.random() * 1000)}`, username };
    console.log(`👤 Đã đăng nhập: ${username}`);
    res.status(200).json({ message: "Đăng nhập thành công!", user: mockUser });
});
const PORT = process.env.PORT || 8081;
app.listen(PORT, async () => {
    await connectRabbitMQ();
    console.log(`User Service running on port ${PORT}`);
});