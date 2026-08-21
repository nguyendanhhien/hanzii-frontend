// File: frontend/src/components/WritingBox.jsx
import { colors, fontStack, shadow } from '../styles';
import InfoRow from './InfoRow';
import HanziStroke from './HanziStroke';

export default function WritingBox({ word, aiData, activeChar }) {
  const character = activeChar || word.hanzi.charAt(0);

  return (
    <div style={{ flex: '1 1 25%', minWidth: '220px', maxWidth: '280px', display: 'flex', flexDirection: 'column', gap: '15px', fontFamily: fontStack.vi }}>
      <div
        style={{
          backgroundColor: colors.bgSoft, // Đổi từ màu trắng sang giấy ám khói
          borderRadius: '4px',           // Góc cạnh giống bí kíp cổ
          padding: '20px',
          boxShadow: shadow.card,
          border: `1px solid ${colors.border}`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* key={character} ép React tạo lại HanziStroke khi đổi chữ */}
        <HanziStroke key={character} character={character} />

        <div style={{ width: '100%', marginTop: '20px' }}>
          <InfoRow label="Bính âm" value={word.pinyin} />
          <InfoRow label="Hán Việt" value={aiData?.ngu_am?.han_viet} />
          <InfoRow label="Thanh điệu" value={aiData?.ngu_am?.thanh_dieu} />
          <InfoRow label="Từ loại" value={aiData?.ngu_nghia?.tu_loai} />
        </div>
      </div>
    </div>
  );
}