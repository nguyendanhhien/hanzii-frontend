// File: frontend/src/components/SearchBar.jsx
import { useEffect, useRef, useState } from 'react';
import { searchWords } from '../api';
import useDebounce from '../hooks/useDebounce';
import useClickOutside from '../hooks/useClickOutside';
import { colors, fontStack, shadow } from '../styles';

export default function SearchBar({ initialValue = '', onSearch, autoFocus = false }) {
  const [inputValue, setInputValue] = useState(initialValue);
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const containerRef = useRef(null);
  const abortRef = useRef(null);
  const debouncedValue = useDebounce(inputValue, 300);

  useClickOutside(containerRef, () => setShowDropdown(false));

  useEffect(() => {
    setInputValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const query = debouncedValue.trim();
    if (!query) {
      setSuggestions([]);
      setShowDropdown(false);
      setLoadingSuggestions(false);
      return;
    }

    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoadingSuggestions(true);
    searchWords(query, controller.signal)
      .then((data) => {
        setSuggestions(data);
        setShowDropdown(true);
        setHighlightIndex(-1);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          console.error('Lỗi lấy gợi ý:', err);
          setSuggestions([]);
        }
      })
      .finally(() => setLoadingSuggestions(false));

    return () => controller.abort();
  }, [debouncedValue]);

  const commitSearch = (term) => {
    const clean = term.trim();
    if (!clean) return;
    setInputValue(clean);
    setShowDropdown(false);
    setHighlightIndex(-1);
    onSearch(clean);
  };

  const handleKeyDown = (e) => {
    if (!showDropdown || suggestions.length === 0) {
      if (e.key === 'Enter') commitSearch(inputValue);
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIndex((i) => (i + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const chosen = highlightIndex >= 0 ? suggestions[highlightIndex].hanzi : inputValue;
      commitSearch(chosen);
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
      setHighlightIndex(-1);
    }
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', maxWidth: '600px', margin: '0 auto' }}>
      
      {/* VỎ KIẾM (Hiệu ứng Lưu Ly / Glassmorphism) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'rgba(28, 26, 22, 0.55)', 
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          borderRadius: '4px', 
          padding: 'clamp(4px, 1vw, 6px) clamp(8px, 2vw, 20px)', // Padding co giãn linh động
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
          border: `1px solid rgba(201, 162, 39, 0.3)`,
          transition: 'border-color 0.3s, box-shadow 0.3s, background-color 0.3s',
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = colors.gold;
          e.currentTarget.style.boxShadow = shadow.glowGold;
          e.currentTarget.style.backgroundColor = 'rgba(28, 26, 22, 0.7)'; 
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = 'rgba(201, 162, 39, 0.3)';
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.5)';
          e.currentTarget.style.backgroundColor = 'rgba(28, 26, 22, 0.55)';
        }}
      >
        <input
          autoFocus={autoFocus}
          type="text"
          placeholder="Nhập khẩu quyết, Hán tự..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => { if (suggestions.length > 0) setShowDropdown(true); }}
          style={{ 
            flex: 1, 
            border: 'none', 
            backgroundColor: 'transparent', 
            outline: 'none', 
            padding: '8px', 
            fontSize: 'clamp(14px, 3vw, 18px)', // Chữ input tự thu nhỏ trên phone
            fontFamily: fontStack.vi,
            color: colors.gold, 
            letterSpacing: '1px',
            width: '100%' // Ép chiếm hết không gian còn lại
          }}
        />
        {inputValue && (
          <button
            type="button"
            aria-label="Thu Kiếm"
            onClick={() => { setInputValue(''); setSuggestions([]); setShowDropdown(false); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: colors.steel, padding: '4px' }}
          >
            ✕
          </button>
        )}
        <button
          type="button"
          onClick={() => commitSearch(inputValue)}
          style={{ 
            backgroundColor: colors.accent,
            border: `1px solid ${colors.accentDark}`, 
            cursor: 'pointer', 
            fontSize: 'clamp(12px, 3vw, 16px)', // Chữ nút tự thu nhỏ
            fontWeight: 'bold',
            color: colors.text, 
            borderRadius: '4px', 
            padding: 'clamp(6px, 1.5vw, 10px) clamp(10px, 2vw, 20px)', // Padding nút thu nhỏ
            marginLeft: '8px',
            fontFamily: fontStack.vi,
            letterSpacing: '1px',
            textShadow: '0 1px 2px rgba(0,0,0,0.5)',
            whiteSpace: 'nowrap', // CẤM XUỐNG DÒNG LÀM MÓP NÚT
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.accentDark}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.accent}
        >
          🗡️ Xuất Kiếm
        </button>
      </div>

      {/* KHUNG GỢI Ý */}
      {showDropdown && (
        <div
          style={{
            position: 'absolute',
            top: '110%',
            left: 0,
            right: 0,
            backgroundColor: 'rgba(28, 26, 22, 0.85)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderRadius: '4px',
            boxShadow: shadow.float,
            border: `1px solid rgba(201, 162, 39, 0.2)`,
            zIndex: 1000,
            overflow: 'hidden',
          }}
        >
          {loadingSuggestions && (
            <div style={{ padding: '14px 20px', color: colors.textMuted, fontSize: '14px', fontStyle: 'italic', fontFamily: fontStack.vi }}>Đang vận công dò tìm...</div>
          )}

          {!loadingSuggestions && suggestions.length === 0 && (
            <div style={{ padding: '14px 20px', color: colors.accent, fontSize: '14px', fontFamily: fontStack.vi }}>
              Không tìm thấy tâm pháp "{inputValue}"
            </div>
          )}

          {!loadingSuggestions && suggestions.map((item, index) => (
            <div
              key={item._id}
              onMouseDown={(e) => { e.preventDefault(); commitSearch(item.hanzi); }}
              onMouseEnter={() => setHighlightIndex(index)}
              style={{
                padding: 'clamp(10px, 2vw, 14px) clamp(15px, 3vw, 20px)',
                display: 'flex',
                gap: '10px',
                alignItems: 'center',
                cursor: 'pointer',
                borderBottom: `1px solid rgba(255, 255, 255, 0.05)`,
                backgroundColor: index === highlightIndex ? 'rgba(201, 162, 39, 0.15)' : 'transparent',
                transition: 'background-color 0.2s',
              }}
            >
              <span style={{ fontSize: 'clamp(18px, 4vw, 24px)', fontWeight: 'bold', color: colors.gold, fontFamily: fontStack.hanzi, letterSpacing: '2px' }}>{item.hanzi}</span>
              <span style={{ color: colors.steel, fontSize: '12px', fontFamily: fontStack.pinyin }}>[{item.pinyin}]</span>
              <span style={{ color: colors.textMuted, marginLeft: 'auto', textAlign: 'right', fontSize: '12px', fontFamily: fontStack.vi }}>{item.meaning}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}