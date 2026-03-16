const API_BASE = 'http://localhost:3000/api';

const titleInput = document.getElementById('title');
const contentInput = document.getElementById('content');
const authorInput = document.getElementById('author');
const keywordInput = document.getElementById('keyword');
const saveBtn = document.getElementById('saveBtn');
const refreshPostsBtn = document.getElementById('refreshPosts');
const refreshLogsBtn = document.getElementById('refreshLogs');
const statusEl = document.getElementById('status');
const postsEl = document.getElementById('posts');
const logsEl = document.getElementById('logs');
const seoEl = document.getElementById('seoReport');

const setStatus = (text, isError = false) => {
  statusEl.textContent = text;
  statusEl.classList.toggle('error', isError);
};

const postItemTemplate = (post) => `
  <article class="item">
    <h3>${post.title}</h3>
    <p class="meta">Tác giả: ${post.author || 'anonymous'}</p>
    <p>${post.content || '(Không có nội dung)'}</p>
    <p class="timestamp">${new Date(post.createdAt).toLocaleString()}</p>
  </article>
`;

const logItemTemplate = (log) => `
  <article class="item">
    <h3>${log.action}</h3>
    <p class="meta">Actor: ${log.actor}</p>
    <p class="timestamp">${new Date(log.timestamp).toLocaleString()}</p>
  </article>
`;

const seoTemplate = (seo) => `
  <p><b>Keyword:</b> ${seo.keyword || '(none)'}</p>
  <p><b>Tổng từ:</b> ${seo.totalWords}</p>
  <p><b>Số lần xuất hiện:</b> ${seo.keywordHits}</p>
  <p><b>Mật độ:</b> ${seo.density}%</p>
  <p><b>Khuyến nghị:</b> ${seo.recommendation}</p>
`;

const loadPosts = async () => {
  try {
    const res = await fetch(`${API_BASE}/posts`);
    const posts = await res.json();
    const view = Array.isArray(posts) ? posts.slice().reverse().map(postItemTemplate).join('') : '';
    postsEl.innerHTML = view || '<p class="meta">Chưa có bài viết nào.</p>';
  } catch {
    postsEl.innerHTML = '<p class="meta">Không thể tải danh sách bài viết.</p>';
  }
};

const loadLogs = async () => {
  try {
    const res = await fetch(`${API_BASE}/audit-logs`);
    const logs = await res.json();
    const view = Array.isArray(logs)
      ? logs.slice(-8).reverse().map(logItemTemplate).join('')
      : '';
    logsEl.innerHTML = view || '<p class="meta">Chưa có log nào.</p>';
  } catch {
    logsEl.innerHTML = '<p class="meta">Không thể tải audit logs.</p>';
  }
};

const savePost = async () => {
  setStatus('Đang lưu bài viết...');

  try {
    const payload = {
      title: titleInput.value,
      content: contentInput.value,
      keyword: keywordInput.value,
      author: authorInput.value
    };

    const res = await fetch(`${API_BASE}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.error || 'Lưu bài viết thất bại.');
    }

    seoEl.classList.remove('empty');
    seoEl.innerHTML = seoTemplate(result.seo || {});
    setStatus(`Đã lưu thành công bài viết ID: ${result.id}`);

    await Promise.all([loadPosts(), loadLogs()]);
  } catch (error) {
    setStatus(error.message, true);
  }
};

saveBtn.addEventListener('click', savePost);
refreshPostsBtn.addEventListener('click', loadPosts);
refreshLogsBtn.addEventListener('click', loadLogs);

loadPosts();
loadLogs();