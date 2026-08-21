// File: frontend/src/components/CharacterChips.jsx
import { colors, fontStack } from '../styles'; // Đã sửa lại đường dẫn chuẩn

export default function CharacterChips({ hanzi, activeChar, onSelect }) {
  const chars = Array.from(hanzi);
  if (chars.length <= 1) return null;

  return (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', fontFamily: fontStack.vi }}>
      {chars.map((ch, i) => {
        const isActive = ch === activeChar;
        return (
          <button
            key={`${ch}-${i}`}
            onClick={() => onSelect(ch)}
            title={`Xem nét viết chữ "${ch}"`}
            style={{
              fontSize: '22px',
              fontWeight: 'bold',
              color: isActive ? colors.gold : colors.text,
              backgroundColor: isActive ? '#450a0a' : colors.bg, // Nền đỏ sậm khi chọn, nền đen ấm khi bình thường
              border: `1px solid ${isActive ? colors.accent : colors.border}`,
              borderRadius: '4px',
              padding: '6px 14px',
              cursor: 'pointer',
              fontFamily: fontStack.hanzi,
              transition: 'all 0.2s',
            }}
          >
            {ch}
          </button>
        );
      })}
      <span style={{ fontSize: '12px', color: colors.textMuted, fontStyle: 'italic' }}>Bấm để xem nét viết từng chữ</span>
    </div>
  );
}