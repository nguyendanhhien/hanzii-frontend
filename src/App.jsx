// File: frontend/src/App.jsx
import { useState } from 'react';
import { searchWords } from './api';
import SearchBar from './components/SearchBar';
import ResultsList from './components/ResultsList';
import { colors, fontStack } from './styles';

/**
 * So với bản trước, các lỗi tương tác đã sửa ở App.jsx:
 * - Có trạng thái "loading" / "error" / "success" rõ ràng cho kết quả
 *   chính (trước đây chỉ log lỗi ra console, người dùng không biết gì).
 * - Có nút "Thử lại" khi tìm kiếm lỗi.
 * - Logic gợi ý (debounce, huỷ request cũ, điều hướng bàn phím) đã
 *   chuyển hết vào SearchBar, App chỉ cần quan tâm "khi nào tìm kiếm
 *   chính thức xảy ra".
 */
function App() {
  const [isSearched, setIsSearched] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [words, setWords] = useState([]);
  const [status, setStatus] = useState('idle'); // idle | loading | success | error

  const runSearch = (term) => {
    setSearchTerm(term);
    setIsSearched(true);
    setStatus('loading');

    searchWords(term)
      .then((data) => {
        setWords(data);
        setStatus('success');
      })
      .catch((err) => {
        console.error('Lỗi tìm kiếm:', err);
        setStatus('error');
      });
  };

  const goHome = () => {
    setIsSearched(false);
    setSearchTerm('');
    setWords([]);
    setStatus('idle');
  };

  const handleAnalyzed = (wordId, aiDetails) => {
    setWords((prev) => prev.map((w) => (w._id === wordId ? { ...w, ai_details: aiDetails } : w)));
  };

  // 1. TRANG CHỦ
  if (!isSearched) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: colors.bgSoft,
          fontFamily: fontStack,
          padding: '0 20px',
        }}
      >
        <h1 style={{ fontSize: '50px', color: colors.text, marginBottom: '10px' }}>
          🐼 Hanzii <span style={{ color: colors.accent }}>Pro</span>
        </h1>
        <p style={{ fontSize: '18px', color: colors.textMuted, marginBottom: '40px', textAlign: 'center' }}>
          Tra cứu từ vựng và phân tích ngữ pháp bằng Trí tuệ Nhân tạo
        </p>
        <SearchBar onSearch={runSearch} autoFocus />
      </div>
    );
  }

  // 2. TRANG KẾT QUẢ
  return (
    <div style={{ backgroundColor: colors.bg, minHeight: '100vh', fontFamily: fontStack }}>
      <div
        style={{
          backgroundColor: colors.white,
          padding: '15px 40px',
          display: 'flex',
          alignItems: 'center',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          gap: '30px',
          flexWrap: 'wrap',
        }}
      >
        <h2 onClick={goHome} style={{ color: colors.text, margin: 0, display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
          🐼 Hanzii{' '}
          <span style={{ fontSize: '14px', backgroundColor: colors.accent, color: 'white', padding: '2px 8px', borderRadius: '12px' }}>
            Pro
          </span>
        </h2>
        <div style={{ flex: 1, minWidth: '260px' }}>
          <SearchBar initialValue={searchTerm} onSearch={runSearch} />
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '30px auto', padding: '0 20px' }}>
        <ResultsList
          words={words}
          status={status}
          searchTerm={searchTerm}
          onRetry={() => runSearch(searchTerm)}
          onAnalyzed={handleAnalyzed}
        />
      </div>
    </div>
  );
}

export default App;