// File: frontend/src/components/ResultsList.jsx
import { colors } from '../styles';
import WordCard from './WordCard';

export default function ResultsList({ words, status, searchTerm, onRetry, onAnalyzed }) {
  if (status === 'loading') {
    return (
      <div style={{ textAlign: 'center', marginTop: '60px', color: colors.textMuted, fontSize: '16px' }}>
        Đang tìm "{searchTerm}"...
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div style={{ textAlign: 'center', marginTop: '60px', color: colors.accentDark }}>
        <p style={{ fontSize: '16px', marginBottom: '12px' }}>Có lỗi khi tải dữ liệu. Kiểm tra kết nối và thử lại.</p>
        <button
          onClick={onRetry}
          style={{ padding: '10px 20px', borderRadius: '20px', border: 'none', backgroundColor: colors.accent, color: 'white', cursor: 'pointer' }}
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (words.length === 0) {
    return (
      <div style={{ textAlign: 'center', marginTop: '60px', color: colors.textMuted }}>
        Không tìm thấy từ vựng nào cho "{searchTerm}". Hãy thử từ khóa khác!
      </div>
    );
  }

  return words.map((word) => (
    <WordCard key={word._id} word={word} onAnalyzed={onAnalyzed} />
  ));
}