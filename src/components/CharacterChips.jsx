// File: frontend/src/components/CharacterChips.jsx
import { colors } from '../styles';

/**
 * Tách chuỗi Hán tự thành từng chip riêng.
 * - Bấm vào chip: chọn ký tự đó để hiện lên khung tập viết bên phải
 *   (cập nhật ngay lập tức, không gọi API).
 * - Chip đang được chọn sẽ có viền đỏ nổi bật.
 */
export default function CharacterChips({ hanzi, activeChar, onSelect }) {
  const chars = Array.from(hanzi);
  if (chars.length <= 1) return null;

  return (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
      {chars.map((ch, i) => {
        const isActive = ch === activeChar;
        return (
          <button
            key={`${ch}-${i}`}
            onClick={() => onSelect(ch)}
            title={`Xem nét viết chữ "${ch}"`}
            style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: isActive ? colors.accent : colors.text,
              backgroundColor: isActive ? '#fbeceb' : colors.bgSoft,
              border: `1px solid ${isActive ? colors.accent : colors.border}`,
              borderRadius: '10px',
              padding: '6px 14px',
              cursor: 'pointer',
              transition: 'border-color 0.15s, color 0.15s',
            }}
          >
            {ch}
          </button>
        );
      })}
      <span style={{ fontSize: '12px', color: colors.textMuted }}>Bấm để xem nét viết từng chữ</span>
    </div>
  );
}