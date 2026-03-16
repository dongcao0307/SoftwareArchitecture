import React, { useState, useEffect } from 'react';
import { usePlugin, Slot } from './PluginContext';
import './App.css';

function App() {
  const { registerUI } = usePlugin();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [keyword, setKeyword] = useState('microkernel');
  const [author, setAuthor] = useState('Hậu IT');
  const [status, setStatus] = useState('Sẵn sàng');
  const [seoReport, setSeoReport] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    window.CMS_CORE = { register: registerUI };
    const script = document.createElement('script');
    script.src = 'http://localhost:3000/cdn/seo-plugin-ui.js';
    document.head.appendChild(script);
  }, [registerUI]);

  const loadAuditLogs = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/audit-logs');
      const logs = await response.json();
      setAuditLogs(Array.isArray(logs) ? logs.slice(-5).reverse() : []);
    } catch (_err) {
      setAuditLogs([]);
    }
  };

  const loadPosts = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/posts');
      const savedPosts = await response.json();
      setPosts(Array.isArray(savedPosts) ? savedPosts.slice().reverse() : []);
    } catch (_err) {
      setPosts([]);
    }
  };

  useEffect(() => {
    loadAuditLogs();
    loadPosts();
  }, []);

  const handleSave = async () => {
    try {
      setError('');
      setStatus('Đang lưu...');
      const response = await fetch('http://localhost:3000/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, keyword, author })
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Lưu bài viết thất bại');
      }

      setSeoReport(result.post?.seo || null);
      setStatus(`Đã lưu thành công ID: ${result.post?.id}`);
      loadAuditLogs();
      loadPosts();
    } catch (err) {
      setStatus('Lỗi khi lưu bài viết');
      setError(err.message);
    }
  };

  return (
    <div className="app-shell">
      <header className="hero">
        <p className="badge">CMS Microkernel</p>
        <h1>DongCao Content Studio</h1>
        <p className="hero-subtitle">Lưu nội dung, kiểm tra SEO tự động và theo dõi hoạt động hệ thống theo thời gian thực.</p>
      </header>

      <section className="form-panel">
        <input
          className="text-input"
          type="text"
          placeholder="Nhập tiêu đề bài viết..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="text-input"
          type="text"
          placeholder="Tác giả"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <input
          className="text-input"
          type="text"
          placeholder="Từ khóa SEO"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button onClick={handleSave} className="btn btn-primary">
          Lưu bài viết
        </button>
      </section>

      <section className="status-row">
        <p>Trạng thái hệ thống: <b>{status}</b></p>
        {error && <p className="error-text">Chi tiết lỗi: {error}</p>}
      </section>

      <section className="layout-grid">
        <div className="panel panel-main">
          <h3>Nội dung chính (Core)</h3>
          <textarea
            className="editor-area"
            placeholder="Viết gì đó..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <h4>Kết quả SEO Plugin</h4>
          {seoReport ? (
            <div className="seo-card">
              <p><b>Keyword:</b> {seoReport.keyword || '(none)'}</p>
              <p><b>Tổng từ:</b> {seoReport.totalWords}</p>
              <p><b>Số lần xuất hiện:</b> {seoReport.keywordHits}</p>
              <p><b>Mật độ:</b> {seoReport.density}%</p>
              <p><b>Khuyến nghị:</b> {seoReport.recommendation}</p>
            </div>
          ) : (
            <p className="muted">Chưa có phân tích SEO.</p>
          )}

          <div className="section-header">
            <h4>Bài viết đã lưu</h4>
            <button onClick={loadPosts} className="btn btn-secondary">Làm mới danh sách bài viết</button>
          </div>

          {posts.length === 0 ? (
            <p className="muted">Chưa có bài viết nào.</p>
          ) : (
            <div className="post-list">
              {posts.map((post) => (
                <article key={post.id} className="post-card">
                  <h5>{post.title}</h5>
                  <p className="post-meta">Tác giả: {post.author}</p>
                  <p>{post.content || '(Không có nội dung)'}</p>
                  <p className="post-time">{new Date(post.createdAt).toLocaleString()}</p>
                </article>
              ))}
            </div>
          )}
        </div>

        <aside className="panel panel-side">
          <h3>Plugin Sidebar</h3>
          <div className="slot-wrap">
            <Slot name="sidebar" data={{ titleLength: title.length }} />
          </div>

          <div className="section-header">
            <h4>Audit Log Plugin</h4>
            <button onClick={loadAuditLogs} className="btn btn-secondary">Làm mới log</button>
          </div>

          <ul className="audit-list">
            {auditLogs.map((log) => (
              <li key={log.id}>
                <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                <b>{log.actor}</b>
                <span>{log.action}</span>
              </li>
            ))}
          </ul>
        </aside>
      </section>
    </div>
  );
}

export default App;
