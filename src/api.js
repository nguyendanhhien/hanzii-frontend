// File: frontend/src/api.js
// Gom toàn bộ logic gọi API vào 1 nơi duy nhất — dễ đổi base URL,
// dễ bắt lỗi, và dùng AbortController để huỷ các request cũ (tránh
// tình trạng gợi ý bị "lụt" do request trước trả về sau request sau).

const API_BASE = import.meta.env?.VITE_API_BASE || 'http://localhost:5000';

async function handleResponse(res) {
  if (!res.ok) {
    throw new Error(`Máy chủ trả về lỗi ${res.status}`);
  }
  const data = await res.json();
  if (data.status !== 'success') {
    throw new Error(data.message || 'Yêu cầu không thành công');
  }
  return data.data;
}

/**
 * Tìm từ vựng theo query.
 * @param {string} query
 * @param {AbortSignal} [signal] - để huỷ request khi component unmount hoặc có request mới hơn
 */
export function searchWords(query, signal) {
  const params = new URLSearchParams({ q: query });
  return fetch(`${API_BASE}/api/words?${params.toString()}`, { signal }).then(handleResponse);
}

/**
 * Gọi AI phân tích chi tiết một từ.
 * @param {string} wordId
 */
export function analyzeWord(wordId) {
  return fetch(`${API_BASE}/api/words/${wordId}/analyze`, { method: 'POST' }).then(handleResponse);
}
