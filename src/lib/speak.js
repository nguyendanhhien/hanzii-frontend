// File: frontend/src/lib/speak.js
// Phát âm bằng Web Speech API của trình duyệt — không cần file audio,
// không tốn thêm request lên server. Hanzii.net dùng file mp3 sẵn có,
// còn mình không có kho audio nên dùng giải pháp built-in của Chrome.
export function speak(text, lang = 'zh-CN') {
  if (!('speechSynthesis' in window)) {
    console.warn('Trình duyệt không hỗ trợ phát âm.');
    return;
  }
  window.speechSynthesis.cancel(); // huỷ câu đang đọc dở nếu có
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 0.9;
  window.speechSynthesis.speak(utterance);
}
