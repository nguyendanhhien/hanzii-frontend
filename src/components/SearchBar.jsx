// File: frontend/src/components/SearchBar.jsx
import { useEffect, useRef, useState } from 'react';
import { searchWords } from '../api';
import useDebounce from '../hooks/useDebounce';
import useClickOutside from '../hooks/useClickOutside';
import { colors, shadow, fontStack } from '../styles';

/**
 * Ô tìm kiếm dùng chung cho cả trang chủ và navbar.
 *
 * So với bản cũ, các lỗi tương tác đã được sửa:
 * - Gõ phím không còn gọi API ngay lập tức (debounce 300ms), đỡ tốn
 *   request và đỡ giật khi gõ nhanh.
 * - Request gợi ý cũ bị huỷ khi có request mới hơn (AbortController),
 *   nên không còn tình trạng gợi ý "về sau" của một từ gõ trước đè lên
 *   kết quả của từ gõ sau.
 * - Bấm ra ngoài dropdown sẽ tự đóng lại (trước đây bị kẹt trên màn hình).
 * - Điều hướng bằng bàn phím: ↑/↓ để chọn, Enter để xác nhận, Esc để đóng.
 * - Có trạng thái "đang tải" và "không có gợi ý" thay vì im lặng.
 */
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

  // Giữ ô input đồng bộ nếu component cha đổi giá trị (vd. click logo về trang chủ)
  useEffect(() => {
    setInputValue(initialValue);
  }, [initialValue]);

  // Gọi API gợi ý mỗi khi giá trị đã debounce thay đổi
  useEffect(() => {
    const query = debouncedValue.trim();
    if (!query) {
      setSuggestions([]);
      setShowDropdown(false);
      setLoadingSuggestions(false);
      return;
    }

    // Huỷ request gợi ý trước đó nếu còn đang chạy
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
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: colors.white,
          borderRadius: '24px',
          padding: '5px 8px 5px 20px',
          boxShadow: shadow.card,
          border: `1px solid ${colors.border}`,
        }}
      >
        <input
          autoFocus={autoFocus}
          type="text"
          placeholder="Nhập Hán tự, Pinyin, hoặc tiếng Việt..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => { if (suggestions.length > 0) setShowDropdown(true); }}
          style={{ flex: 1, border: 'none', backgroundColor: 'transparent', outline: 'none', padding: '10px', fontSize: '16px', fontFamily: fontStack }}
        />
        {inputValue && (
          <button
            type="button"
            aria-label="Xoá"
            onClick={() => { setInputValue(''); setSuggestions([]); setShowDropdown(false); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: colors.textMuted, padding: '6px' }}
          >
            ✕
          </button>
        )}
        <button
          type="button"
          onClick={() => commitSearch(inputValue)}
          style={{ background: colors.accent, border: 'none', cursor: 'pointer', fontSize: '16px', color: 'white', borderRadius: '18px', padding: '10px 16px', marginLeft: '4px' }}
        >
          🔍
        </button>
      </div>

      {showDropdown && (
        <div
          style={{
            position: 'absolute',
            top: '110%',
            left: 0,
            right: 0,
            backgroundColor: colors.white,
            borderRadius: '12px',
            boxShadow: shadow.float,
            zIndex: 1000,
            overflow: 'hidden',
          }}
        >
          {loadingSuggestions && (
            <div style={{ padding: '14px 20px', color: colors.textMuted, fontSize: '14px' }}>Đang tìm...</div>
          )}

          {!loadingSuggestions && suggestions.length === 0 && (
            <div style={{ padding: '14px 20px', color: colors.textMuted, fontSize: '14px' }}>
              Không có gợi ý nào cho "{inputValue}"
            </div>
          )}

          {!loadingSuggestions && suggestions.map((item, index) => (
            <div
              key={item._id}
              onMouseDown={(e) => { e.preventDefault(); commitSearch(item.hanzi); }}
              onMouseEnter={() => setHighlightIndex(index)}
              style={{
                padding: '12px 20px',
                display: 'flex',
                gap: '15px',
                alignItems: 'center',
                cursor: 'pointer',
                borderBottom: `1px solid ${colors.border}`,
                backgroundColor: index === highlightIndex ? '#fbeceb' : colors.white,
              }}
            >
              <span style={{ fontSize: '20px', fontWeight: 'bold', color: colors.accent }}>{item.hanzi}</span>
              <span style={{ color: colors.textMuted }}>{item.pinyin}</span>
              <span style={{ color: colors.text, marginLeft: 'auto', textAlign: 'right' }}>{item.meaning}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
