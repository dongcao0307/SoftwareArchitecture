import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [movies, setMovies] = useState([]);
  const [message, setMessage] = useState('');
  
  // State cho Auth
  const [isLoginView, setIsLoginView] = useState(true);
  const [username, setUsername] = useState('');
  
  // State cho Đặt vé
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]); 

  // State cho Thêm Phim
  const [showAddMovie, setShowAddMovie] = useState(false);
  const [newMovie, setNewMovie] = useState({ title: '', genre: '', price: '' });

  // 💰 State cho Ví tiền (Áp dụng CQRS/Event Sourcing)
  const [balance, setBalance] = useState(0);

  const GATEWAY_API = import.meta.env.VITE_GATEWAY_API;

  // Tạo danh sách ghế mẫu (5 hàng A-E x 10 ghế)
  const rows = ['A', 'B', 'C', 'D', 'E'];
  const cols = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const allSeats = [];
  rows.forEach(r => cols.forEach(c => allSeats.push(`${r}${c}`)));

  // Gọi API lấy danh sách phim
  const fetchMovies = () => {
    fetch(`${GATEWAY_API}/api/movies/movies`)
      .then(res => res.json())
      .then(data => setMovies(data.data || []))
      .catch(() => showMessage("Lỗi kết nối đến Movie Service!"));
  };

  // 💰 Gọi API lấy số dư (CQRS - Query)
  const fetchBalance = async () => {
    if (!user) return;
    try {
      const res = await fetch(`${GATEWAY_API}/api/payment/wallet/${user.id}/balance`);
      const data = await res.json();
      setBalance(data.balance || 0);
    } catch (err) {
      console.error("Lỗi lấy số dư:", err);
    }
  };

  // Tự động load Phim và Số dư khi đăng nhập thành công
  useEffect(() => {
    if (user) {
      fetchMovies();
      fetchBalance();
    }
  }, [user]);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 5000);
  };

  // 💰 Gọi API Nạp tiền giả lập (CQRS - Command)
  const handleDeposit = async () => {
    try {
      const res = await fetch(`${GATEWAY_API}/api/payment/wallet/deposit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, amount: 500000 }) // Nạp cứng 500k
      });
      if (res.ok) {
        showMessage("✅ Nạp 500.000 VNĐ thành công!");
        fetchBalance(); // Load lại số dư ngay lập tức
      }
    } catch {
      showMessage("Lỗi kết nối khi nạp tiền!");
    }
  };

  // --- CHỨC NĂNG 1: ĐĂNG KÝ / ĐĂNG NHẬP ---
  const handleAuth = async (e) => {
    e.preventDefault();
    const endpoint = isLoginView ? '/login' : '/register';
    try {
      const res = await fetch(`${GATEWAY_API}/api/users${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ username, email: `${username}@gmail.com`, password: "123" }) 
      });
      const data = await res.json();
      
      if (res.ok) {
        if (isLoginView) {
          // Lưu user và lấy số dư ngay
          const loggedInUser = data.user || { id: data.id, username };
          setUser(loggedInUser);
          showMessage(`Đăng nhập thành công! Xin chào ${username}`);
        } else {
          showMessage(`Đăng ký thành công tài khoản ${username}! Vui lòng đăng nhập lại.`);
          setIsLoginView(true); 
        }
      } else {
        showMessage(`Lỗi: ${data.message}`);
      }
    } catch {
      showMessage("Không kết nối được API Gateway!");
    }
  };

  // --- CHỨC NĂNG 2: THÊM PHIM ---
  const handleAddMovie = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${GATEWAY_API}/api/movies/movies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newMovie.title,
          genre: newMovie.genre,
          price: parseInt(newMovie.price)
        })
      });
      if (res.ok) {
        showMessage(`Đã thêm phim: ${newMovie.title}`);
        setNewMovie({ title: '', genre: '', price: '' });
        setShowAddMovie(false);
        fetchMovies(); 
      }
    } catch {
      showMessage("Lỗi khi thêm phim!");
    }
  };

  // --- CHỨC NĂNG 3: ĐẶT VÉ ---
  const toggleSeat = (seat) => {
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seat));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const handleBookTicket = async (e) => {
    e.preventDefault();
    if (selectedSeats.length === 0) return showMessage("Vui lòng chọn ít nhất 1 ghế!");
    
    try {
      showMessage(`Đang gửi yêu cầu đặt vé phim ${selectedMovie.title}...`);
      const res = await fetch(`${GATEWAY_API}/api/bookings/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: user.id, 
          movieId: selectedMovie.id, 
          seats: selectedSeats,
          price: selectedMovie.price // ⚡ ĐÃ FIX: Gửi giá phim thực tế xuống Booking
        })
      });
      const data = await res.json();
      showMessage(`✅ ${data.message}`);
      
      setSelectedMovie(null);
      setSelectedSeats([]); 

      // 💰 Tự động làm mới số dư sau 3 giây (chờ Payment xử lý Event xong)
      setTimeout(() => {
        fetchBalance();
      }, 3000);

    } catch {
      showMessage("Lỗi: Không kết nối được Booking Service!");
    }
  };

  return (
    <div className="container glass-panel">
      <h1 className="title">🎬 Play Vault Cinema</h1>
      {message && <div className="alert">{message}</div>}

      {!user ? (
        <div className="auth-section">
<div className="tabs">
            <button className={isLoginView ? "active" : ""} onClick={() => setIsLoginView(true)}>Đăng nhập</button>
            <button className={!isLoginView ? "active" : ""} onClick={() => setIsLoginView(false)}>Đăng ký</button>
          </div>
          <form onSubmit={handleAuth} className="login-form">
            <h2>{isLoginView ? 'Đăng nhập hệ thống' : 'Tạo tài khoản mới'}</h2>
            <input 
              type="text" 
              placeholder="Tên đăng nhập (VD: HauTran)" 
              value={username} onChange={(e) => setUsername(e.target.value)} required 
            />
            <button type="submit">{isLoginView ? 'Đăng nhập' : 'Đăng ký'}</button>
          </form>
        </div>
      ) : (
        <div className="dashboard">
          
          {/* 💰 KHU VỰC VÍ TIỀN (GLASSMORPHISM STYLE) */}
          <div className="wallet-info glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '15px' }}>
            <h3 style={{ margin: 0 }}>Ví của bạn: <span style={{ color: '#f1c40f', fontSize: '1.2em' }}>{balance.toLocaleString()} VNĐ</span></h3>
            <div>
              <button onClick={handleDeposit} style={{ background: '#2ecc71', marginRight: '10px' }}>+ Nạp 500k</button>
              <button onClick={fetchBalance} style={{ background: '#34495e' }}>🔄 Làm mới</button>
            </div>
          </div>

          <div className="header-actions">
             <h2>Phim Đang Chiếu</h2>
             <button onClick={() => setShowAddMovie(!showAddMovie)} className="btn-secondary">
               {showAddMovie ? 'Đóng Thêm Phim' : '+ Thêm Phim Mới'}
             </button>
          </div>

          {/* Form Thêm Phim */}
          {showAddMovie && (
            <form onSubmit={handleAddMovie} className="add-movie-form glass-panel">
              <input type="text" placeholder="Tên phim" value={newMovie.title} onChange={e => setNewMovie({...newMovie, title: e.target.value})} required />
              
              <select value={newMovie.genre} onChange={e => setNewMovie({...newMovie, genre: e.target.value})} required>
                <option value="" disabled>Chọn thể loại</option>
                <option value="Hành động">Hành động</option>
                <option value="Viễn tưởng">Viễn tưởng</option>
                <option value="Kinh dị">Kinh dị</option>
                <option value="Hài hước">Hài hước</option>
                <option value="Tình cảm">Tình cảm</option>
                <option value="Hoạt hình">Hoạt hình</option>
              </select>

              <input type="number" placeholder="Giá vé (VNĐ)" value={newMovie.price} onChange={e => setNewMovie({...newMovie, price: e.target.value})} required />
              <button type="submit">Lưu Phim</button>
            </form>
          )}
{/* Sơ đồ chọn ghế */}
          {selectedMovie && (
            <form onSubmit={handleBookTicket} className="booking-modal glass-panel">
              <h3>Đặt vé: {selectedMovie.title} (Giá: {selectedMovie.price?.toLocaleString()}đ/ghế)</h3>
              <p style={{ background: '#555', padding: '5px 20px', borderRadius: '5px' }}>Màn hình chiếu</p>
              
              <div className="seat-grid">
                {allSeats.map(seat => (
                  <button
                    key={seat}
                    type="button"
                    className={`seat-btn ${selectedSeats.includes(seat) ? 'selected' : ''}`}
                    onClick={() => toggleSeat(seat)}
                  >
                    {seat}
                  </button>
                ))}
              </div>

              <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                <p>Ghế đang chọn: <strong>{selectedSeats.length > 0 ? selectedSeats.join(', ') : 'Chưa chọn'}</strong></p>
                <p>Tổng tiền dự kiến: <strong style={{ color: '#f1c40f' }}>{(selectedSeats.length * selectedMovie.price || 0).toLocaleString()} VNĐ</strong></p>
              </div>

              <div className="modal-actions">
                <button type="submit">Xác nhận Đặt</button>
                <button type="button" onClick={() => { setSelectedMovie(null); setSelectedSeats([]); }} className="btn-cancel">Hủy</button>
              </div>
            </form>
          )}

          {/* Danh sách phim */}
          <div className="grid">
            {movies.map(movie => (
              <div key={movie.id} className="movie-card">
                <h3>{movie.title}</h3>
                <p>Thể loại: {movie.genre}</p>
                <p>Giá: {movie.price?.toLocaleString()} VNĐ</p>
                <button onClick={() => setSelectedMovie(movie)}>Chọn Vé</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
