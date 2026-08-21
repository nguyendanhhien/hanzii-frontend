// File: frontend/src/components/HanziStroke.jsx
import { useEffect, useRef, useState } from 'react';
import HanziWriter from 'hanzi-writer';
import { colors, fontStack } from '../styles';

export default function HanziStroke({ character, size = 180 }) {
  const containerRef = useRef(null);
  const writerRef = useRef(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    if (!containerRef.current || !character) return;

    setStatus('loading');
    containerRef.current.innerHTML = ''; 

    let cancelled = false;

    try {
      const writer = HanziWriter.create(containerRef.current, character, {
        width: size,
        height: size,
        padding: 12,
        showOutline: true,
        strokeAnimationSpeed: 1.5,
        delayBetweenStrokes: 250,
        // Ép màu sắc theo chuẩn Bí Kíp
        strokeColor: colors.gold,       // Nét vẽ thực: Vàng Kim
        outlineColor: '#374151',        // Nét mờ chờ vẽ: Xám tối
        radicalColor: colors.accent,    // Bộ thủ: Đỏ Chu Sa
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
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
      <div
        ref={containerRef}
        style={{
          width: size,
          height: size,
          border: `1px solid ${colors.accent}`,
          backgroundColor: colors.bg,
          position: 'relative',
          borderRadius: '2px',
          // Vẽ Lưới thư pháp chữ Mễ (Mi-zi-ge) chìm dưới nền
          backgroundImage: `
            linear-gradient(to bottom, transparent 49.5%, ${colors.border} 49.5%, ${colors.border} 50.5%, transparent 50.5%),
            linear-gradient(to right, transparent 49.5%, ${colors.border} 49.5%, ${colors.border} 50.5%, transparent 50.5%),
            linear-gradient(45deg, transparent 49.5%, ${colors.border} 49.5%, ${colors.border} 50.5%, transparent 50.5%),
            linear-gradient(-45deg, transparent 49.5%, ${colors.border} 49.5%, ${colors.border} 50.5%, transparent 50.5%)
          `,
        }}
      >
        {status === 'error' && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', color: colors.accent, textAlign: 'center', padding: '10px', fontFamily: fontStack.vi }}>
            Không tải được dữ liệu cho "{character}"
          </div>
        )}
      </div>
      <button
        onClick={replay}
        disabled={status !== 'ready'}
        style={{
          fontSize: '14px',
          padding: '8px 20px',
          borderRadius: '4px',
          border: `1px solid ${colors.accent}`,
          backgroundColor: colors.bgSoft,
          color: colors.gold, // Chữ vàng kim
          cursor: status === 'ready' ? 'pointer' : 'not-allowed',
          fontFamily: fontStack.vi,
          opacity: status === 'ready' ? 1 : 0.5,
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => { if (status === 'ready') e.currentTarget.style.backgroundColor = colors.border; }}
        onMouseLeave={(e) => { if (status === 'ready') e.currentTarget.style.backgroundColor = colors.bgSoft; }}
      >
        ▶ Vận Công Nét Bút
      </button>
    </div>
  );
}