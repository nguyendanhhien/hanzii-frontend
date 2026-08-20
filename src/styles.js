// File: frontend/src/styles.js
// Bảng màu & token dùng chung. Trước đây mỗi component tự khai báo lại
// màu sắc/khoảng cách bằng tay -> dễ lệch nhau. Gom về đây để đồng bộ.

export const colors = {
  accent: '#e74c3c',      // đỏ Hanzii
  accentDark: '#c0392b',
  purple: '#8e44ad',
  blue: '#2980b9',
  text: '#2c3e50',
  textMuted: '#7f8c8d',
  border: '#eef0f2',
  bg: '#f5f6fa',
  bgSoft: '#f9f9f9',
  white: '#ffffff',
  disabled: '#bdc3c7',
};

export const shadow = {
  card: '0 4px 16px rgba(15, 23, 42, 0.06)',
  float: '0 8px 24px rgba(15, 23, 42, 0.12)',
};

export const fontStack = '"Segoe UI", Roboto, Helvetica, Arial, sans-serif';
