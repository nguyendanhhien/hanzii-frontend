// File: frontend/src/styles.js
// Bảng màu & token phong cách Tu Tiên - Kiếm Pháp

export const colors = {
  bg: '#14120f',         // Nền: mực đen ấm
  bgSoft: '#1c1a16',     // Thẻ: như trang giấy bị ám khói đèn dầu
  text: '#e8e2d3',       // Chữ chính: màu giấy cũ
  textMuted: '#a89f8c',  // Chữ phụ: mờ ảo
  accent: '#b3272c',     // Son đỏ: dấu ấn triện
  accentDark: '#8a1c20', // Đỏ sậm (dùng cho các trạng thái hover/nhấn)
  gold: '#c9a227',       // Chỉ vàng: viền bìa bí kíp
  steel: '#9aa5ad',      // Thép nguội: chi tiết phụ (viền, icon)
  border: '#2a2620',     // Viền mờ tệp với nền ám khói
  disabled: '#374151',   // Xám vô lực (dùng cho nút đang loading)
};

export const fontStack = {
  vi: '"Noto Serif", serif',                     // Tiếng Việt chuẩn sách cổ
  pinyin: '"JetBrains Mono", monospace',         // Pinyin khắc gỗ (khoảng cách đều)
  title: '"Ma Shan Zheng", cursive',             // Thư pháp phiêu bồng
  hanzi: '"STKaiti", "KaiTi", "Ma Shan Zheng", serif' // Chữ Hán tiêu chuẩn (Khải thể)
};

export const shadow = {
  card: '0 4px 15px rgba(0,0,0,0.8)',
  float: '0 10px 25px rgba(0,0,0,0.9)',
  glowGold: '0 0 10px rgba(201, 162, 39, 0.3)',
  glowRed: '0 0 15px rgba(179, 39, 44, 0.4)'
};