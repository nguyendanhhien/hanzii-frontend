// File: frontend/src/components/WritingBox.jsx
import { colors, shadow } from '../styles';
import InfoRow from './InfoRow';
import HanziStroke from './HanziStroke';

export default function WritingBox({ word, aiData, activeChar }) {
  const character = activeChar || word.hanzi.charAt(0);

  return (
    <div style={{ flex: '1 1 25%', minWidth: '220px', maxWidth: '280px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <div
        style={{
          backgroundColor: colors.white,
          borderRadius: '16px',
          padding: '20px',
          boxShadow: shadow.card,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* key={character} ép React tạo lại HanziStroke khi đổi chữ,
            tránh trường hợp animation cũ còn sót lại trên canvas */}
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