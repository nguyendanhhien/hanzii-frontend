// File: frontend/src/components/InfoRow.jsx
import { colors } from '../styles';

/**
 * Một dòng "Nhãn: Giá trị" căn 2 đầu — dùng lại ở nhiều nơi (khung
 * tập viết, phần "Ứng dụng & Ngữ cảnh"...) để đồng bộ layout, thay vì
 * mỗi chỗ tự viết <p><b>Nhãn:</b> giá trị</p> một kiểu khác nhau.
 */
export default function InfoRow({ label, value, align = 'right' }) {
  if (!value) return null;
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: '12px',
        padding: '6px 0',
        borderBottom: `1px solid ${colors.border}`,
        fontSize: '14px',
      }}
    >
      <span style={{ color: colors.textMuted, whiteSpace: 'nowrap' }}>{label}</span>
      <span style={{ color: colors.text, fontWeight: 600, textAlign: align }}>{value}</span>
    </div>
  );
}
