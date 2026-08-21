// File: frontend/src/App.jsx
import { useState } from 'react';
import { searchWords } from './api';
import SearchBar from './components/SearchBar';
import ResultsList from './components/ResultsList';
import { colors, fontStack, shadow } from './styles';
import bgImage from './assets/bg-home.png'; 
import './App.css'; 

function App() {
  const [isSearched, setIsSearched] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [words, setWords] = useState([]);
  const [status, setStatus] = useState('idle');

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

  if (!isSearched) {
    return (
      <div
        style={{
          position: 'relative',
          zIndex: 1, 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: '100vh',
          overflow: 'hidden',
          padding: '8vh 15px', 
        }}
      >
        <div className="sword-bg-image" style={{ backgroundImage: `url(${bgImage})` }}></div>
        <div className="sword-bg-overlay"></div>

        {/* THIÊN: TIÊU ĐỀ JIANJUE (Dùng clamp: Tối thiểu 50px, linh động theo 15% màn hình, tối đa 110px) */}
        <div style={{ zIndex: 10, textAlign: 'center' }}>
          <h1 style={{ 
            fontSize: 'clamp(50px, 15vw, 110px)', 
            color: colors.accent, 
            margin: 0, 
            fontFamily: fontStack.vi,
            fontWeight: 'bold',
            letterSpacing: 'clamp(4px, 2vw, 12px)',
            textShadow: `0 10px 30px rgba(0,0,0,0.9), ${shadow.glowRed}`,
            lineHeight: 1
          }}>
            JIANJUE
          </h1>
        </div>

        <div style={{ flex: 1 }}></div>

        {/* ĐỊA: KHU VỰC XUẤT KIẾM */}
        <div style={{ zIndex: 10, width: '100%', maxWidth: '600px', marginBottom: '4vh' }}>
          <SearchBar onSearch={runSearch} autoFocus />
        </div>

        {/* TẢ THANH LONG: Cột Khẩu Quyết Trái */}
        <div style={{
          position: 'absolute', left: '3%', top: '50%', transform: 'translateY(-50%)',
          display: 'flex', gap: 'clamp(5px, 2vw, 20px)', alignItems: 'center', zIndex: 5
        }}>
          <div style={{
            writingMode: 'vertical-rl',
            fontFamily: fontStack.title,
            fontSize: 'clamp(32px, 5vw, 56px)', // Linh động 32 -> 56px
            color: colors.gold,
            textShadow: shadow.glowGold,
            letterSpacing: 'clamp(10px, 2vw, 20px)'
          }}>
            剑诀定天关
          </div>
          <div style={{
            display: 'flex', flexDirection: 'column', gap: 'clamp(8px, 1.5vw, 15px)',
            fontFamily: fontStack.vi, 
            fontSize: 'clamp(10px, 1.5vw, 15px)', // Linh động 10 -> 15px
            color: colors.textMuted,
            letterSpacing: '2px', textTransform: 'uppercase', opacity: 0.7
          }}>
            <span>Kiếm</span><span>Quyết</span><span>Định</span><span>Thiên</span><span>Quan</span>
          </div>
        </div>

        {/* HỮU BẠCH HỔ: Cột Khẩu Quyết Phải */}
        <div style={{
          position: 'absolute', right: '3%', top: '50%', transform: 'translateY(-50%)',
          display: 'flex', flexDirection: 'row-reverse', gap: 'clamp(5px, 2vw, 20px)', alignItems: 'center', zIndex: 5
        }}>
          <div style={{
            writingMode: 'vertical-rl',
            fontFamily: fontStack.title,
            fontSize: 'clamp(32px, 5vw, 56px)',
            color: colors.gold,
            textShadow: shadow.glowGold,
            letterSpacing: 'clamp(10px, 2vw, 20px)'
          }}>
            坚决悟四言
          </div>
          <div style={{
            display: 'flex', flexDirection: 'column', gap: 'clamp(8px, 1.5vw, 15px)',
            fontFamily: fontStack.vi, fontSize: 'clamp(10px, 1.5vw, 15px)', color: colors.textMuted,
            letterSpacing: '2px', textTransform: 'uppercase', opacity: 0.7
          }}>
            <span>Kiên</span><span>Quyết</span><span>Ngộ</span><span>Tứ</span><span>Ngôn</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: colors.bg, minHeight: '100vh' }}>
      <div style={{ backgroundColor: colors.bgSoft, padding: '15px 40px', display: 'flex', alignItems: 'center', borderBottom: `1px solid ${colors.border}`, boxShadow: shadow.float, position: 'sticky', top: 0, zIndex: 100, gap: '30px', flexWrap: 'wrap' }}>
        <h2 onClick={goHome} style={{ color: colors.accent, margin: 0, display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontFamily: fontStack.vi, fontWeight: 'bold', fontSize: '28px', textShadow: '0 2px 4px rgba(0,0,0,0.5)', letterSpacing: '2px' }}>
          JIANJUE
        </h2>
        <div style={{ flex: 1, minWidth: '260px' }}>
          <SearchBar initialValue={searchTerm} onSearch={runSearch} />
        </div>
      </div>
      <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px' }}>
        <ResultsList words={words} status={status} searchTerm={searchTerm} onRetry={() => runSearch(searchTerm)} onAnalyzed={handleAnalyzed} />
      </div>
    </div>
  );
}

export default App;