require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); // Thêm thư viện MongoDB
const { connectRabbitMQ, publishEvent } = require('./rabbitmq');

const app = express();
app.use(express.json());
app.use(cors());

// 1. KẾT NỐI MONGODB TỪ BIẾN MÔI TRƯỜNG (.env)
mongoose.connect(process.env.MONGO_URI || 'mongodb://admin:password@localhost:27017/booking_db?authSource=admin')
  .then(() => console.log('✅ Đã kết nối Database MongoDB (booking_db)'))
  .catch(err => console.error('❌ Lỗi kết nối Database:', err));

// 2. TẠO BẢNG (SCHEMA) CHO BOOKING
const bookingSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  movieId: { type: String, required: true },
  seats: { type: [String], required: true }, // Lưu mảng các ghế (VD: ['A1', 'A2'])
  status: { type: String, default: 'PENDING' } // Trạng thái mặc định: PENDING (Đang chờ thanh toán)
});
const Booking = mongoose.model('Booking', bookingSchema);

// --- API: TẠO BOOKING MỚI ---
app.post('/bookings', async (req, res) => {
    try {
        const { userId, movieId, seats } = req.body;
        
        // 1. Tạo đơn hàng nháp và lưu trực tiếp vào Database thật
        const newBooking = new Booking({ 
            userId, 
            movieId, 
            seats, 
            status: 'PENDING' 
        });
        const savedBooking = await newBooking.save();
        
        console.log(`🎟️ Đã lưu đơn hàng ${savedBooking._id} vào MongoDB.`);

        // 2. Bắn Event qua RabbitMQ cho Payment Service xử lý
        // Đính kèm cái ID thật vừa được MongoDB sinh ra (_id)
        await publishEvent('movie_exchange', 'BOOKING_CREATED', {
            bookingId: savedBooking._id, 
            userId: savedBooking.userId,
            movieId: savedBooking.movieId,
            seats: savedBooking.seats,
            status: savedBooking.status
        });
        
        res.status(201).json({ 
            message: "Booking đã lưu vào Database, hệ thống đang xử lý thanh toán!", 
            booking: {
                id: savedBooking._id,
                userId: savedBooking.userId,
                movieId: savedBooking.movieId,
                seats: savedBooking.seats,
                status: savedBooking.status
            }
        });
    } catch (error) {
        console.error("Lỗi tạo booking:", error);
        res.status(500).json({ message: "Lỗi hệ thống khi tạo đơn đặt vé!" });
    }
});

const PORT = process.env.PORT || 8083;
app.listen(PORT, async () => {
    await connectRabbitMQ();
    console.log(`🎟️ Booking Service đang chạy tại port ${PORT}`);
});