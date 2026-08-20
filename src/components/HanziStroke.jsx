// File: frontend/src/components/HanziStroke.jsx
import { useEffect, useRef, useState } from 'react';
import HanziWriter from 'hanzi-writer';
import { colors } from '../styles';

/**
 * Vẽ animation nét bút cho 1 ký tự Hán bằng thư viện hanzi-writer.
 * Dữ liệu nét (stroke data) được hanzi-writer tự tải từ CDN công khai
 * (jsdelivr) theo từng ký tự — không cần backend, không cần tự vẽ SVG.
 *
 * Quan trọng: writer phải được tạo lại (destroy + create) mỗi khi
 * `character` đổi, vì hanzi-writer không hỗ trợ đổi ký tự tại chỗ
 * một cách an toàn qua nhiều bản build.
 */
export default function HanziStroke({ character, size = 180 }) {
  const containerRef = useRef(null);
  const writerRef = useRef(null);
  const [status, setStatus] = useState('loading'); // loading | ready | error

  useEffect(() => {
    if (!containerRef.current || !character) return;

    setStatus('loading');
    containerRef.current.innerHTML = ''; // dọn canvas cũ trước khi tạo lại

    let cancelled = false;

    try {
      const writer = HanziWriter.create(containerRef.current, character, {
        width: size,
        height: size,
        padding: 8,
        showOutline: true,
        strokeAnimationSpeed: 1,
        delayBetweenStrokes: 250,
        strokeColor: colors.text,
        outlineColor: '#e0e0e0',
        radicalColor: colors.accent,
        onLoadCharDataSuccess: () => { if (!cancelled) setStatus('ready'); },
        onLoadCharDataError: () => { if (!cancelled) setStatus('error'); },
      });
      writerRef.current = writer;
      writer.animateCharacter();
    } catch (e) {
      console.error('Lỗi khởi tạo HanziWriter:', e);
      setStatus('error');
    }

    return () => {
      cancelled = true;
      writerRef.current = null;
    };
  }, [character, size]);

  const replay = () => {
    writerRef.current?.animateCharacter();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
      <div
        ref={containerRef}
        style={{
          width: size,
          height: size,
          border: `2px dashed ${colors.disabled}`,
          backgroundColor: '#fdfdfd',
          position: 'relative',
        }}
      >
        {status === 'error' && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', color: colors.textMuted, textAlign: 'center', padding: '10px' }}>
            Không tải được dữ liệu nét cho "{character}"
          </div>
        )}
      </div>
      <button
        onClick={replay}
        disabled={status !== 'ready'}
        style={{
          fontSize: '13px',
          padding: '6px 14px',
          borderRadius: '16px',
          border: `1px solid ${colors.border}`,
          backgroundColor: colors.white,
          color: colors.text,
          cursor: status === 'ready' ? 'pointer' : 'not-allowed',
        }}
      >
        ▶ Xem lại nét viết
      </button>
    </div>
  );
}