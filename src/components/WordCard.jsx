// File: frontend/src/components/WordCard.jsx
import { useState } from 'react';
import { analyzeWord } from '../api';
import { colors, shadow } from '../styles';
import { speak } from '../lib/speak';
import CharacterChips from './CharacterChips';
import InfoRow from './InfoRow';
import WritingBox from './WritingBox';

export default function WordCard({ word, onAnalyzed }) {
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [activeChar, setActiveChar] = useState(word.hanzi.charAt(0));

  let aiData = null;
  if (word.ai_details) {
    try {
      aiData = typeof word.ai_details === 'string' ? JSON.parse(word.ai_details) : word.ai_details;
    } catch (e) {
      console.error('Không đọc được dữ liệu AI:', e);
    }
  }

  const handleAnalyze = () => {
    setAnalyzing(true);
    setError(null);
    analyzeWord(word._id)
      .then((data) => onAnalyzed(word._id, data))
      .catch((err) => {
        console.error(err);
        setError('Phân tích thất bại. Vui lòng thử lại.');
      })
      .finally(() => setAnalyzing(false));
  };

  return (
    <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
      {/* CỘT TRÁI: CHI TIẾT TỪ VỰNG */}
      {/* minWidth: 0 để cột được phép co nhỏ hơn nội dung bên trong (câu ví dụ dài...),
          nếu không flexbox sẽ đẩy cột phải xuống dòng dưới dù còn đủ chỗ ngang. */}
      <div style={{ flex: '1 1 70%', minWidth: 0, backgroundColor: colors.white, borderRadius: '16px', padding: '30px', boxShadow: shadow.card }}>

        {/* HEADER: chữ Hán + pinyin + Hán Việt + phát âm, tách kiểu thẻ như bản mẫu */}
        <div style={{ borderBottom: `1px solid ${colors.border}`, paddingBottom: '20px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
            <h1 style={{ fontSize: '42px', color: colors.accent, margin: 0 }}>{word.hanzi}</h1>
            <span style={{ fontSize: '20px', color: colors.textMuted }}>[ {word.pinyin} ]</span>
            {aiData?.ngu_am?.han_viet && (
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: 'bold',
                  color: colors.accentDark,
                  backgroundColor: '#fbeceb',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.3px',
                }}
              >
                {aiData.ngu_am.han_viet}
              </span>
            )}
            <button
              onClick={() => speak(word.hanzi)}
              title="Phát âm"
              style={{
                marginLeft: 'auto',
                border: `1px solid ${colors.border}`,
                backgroundColor: colors.white,
                borderRadius: '20px',
                padding: '8px 16px',
                fontSize: '14px',
                color: colors.text,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              🔊 Phát âm
            </button>
          </div>

          {/* Chip từng chữ Hán riêng lẻ — bấm để đổi khung tập viết bên phải */}
          <div style={{ marginTop: '16px' }}>
            <CharacterChips hanzi={word.hanzi} activeChar={activeChar} onSelect={setActiveChar} />
          </div>
        </div>

        {!aiData ? (
          <div>
            <p style={{ fontSize: '18px', color: colors.text, marginBottom: '20px' }}>
              <b>Nghĩa cơ bản:</b> {word.meaning}
            </p>
            <button
              onClick={handleAnalyze}
              disabled={analyzing}
              style={{
                padding: '12px 24px',
                fontSize: '15px',
                fontWeight: 'bold',
                backgroundColor: analyzing ? colors.disabled : colors.purple,
                color: 'white',
                border: 'none',
                borderRadius: '24px',
                cursor: analyzing ? 'not-allowed' : 'pointer',
              }}
            >
              {analyzing ? '⏳ AI đang phân tích...' : '✨ Phân tích siêu chi tiết'}
            </button>
            {error && (
              <p style={{ marginTop: '12px', color: colors.accentDark, fontSize: '14px' }}>
                {error}{' '}
                <button
                  onClick={handleAnalyze}
                  style={{ border: 'none', background: 'none', color: colors.blue, cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
                >
                  Thử lại
                </button>
              </p>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* MỤC: NGỮ NGHĨA — giống khối "Thành ngữ" bên trái ở bản mẫu */}
            <div>
              <h3 style={{ color: colors.accentDark, margin: '0 0 10px 0', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>▼</span> {aiData.ngu_nghia?.tu_loai || 'Từ vựng'}
              </h3>
              <p style={{ fontSize: '16px', color: colors.text, margin: '0 0 12px 0', lineHeight: 1.6 }}>
                {aiData.ngu_nghia?.nghia_chi_tiet}
              </p>
              <InfoRow label="Lượng từ" value={aiData.ngu_nghia?.luong_tu} />
              <InfoRow label="Mở rộng" value={aiData.ngu_nghia?.tu_lien_quan} />
            </div>

            {/* MỤC: ỨNG DỤNG & NGỮ CẢNH — khối viền trái xanh, giống khối ví dụ ở bản mẫu */}
            <div style={{ backgroundColor: colors.bgSoft, padding: '20px', borderRadius: '12px', borderLeft: `4px solid ${colors.blue}` }}>
              <h3 style={{ color: colors.blue, margin: '0 0 10px 0', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>▼</span> Ứng dụng &amp; Ngữ cảnh
              </h3>
              <InfoRow label="Kết hợp từ" value={aiData.ung_dung?.collocation} align="right" />
              <InfoRow
                label="Ngữ cảnh"
                value={aiData.ung_dung?.ngu_canh ? `${aiData.ung_dung.ngu_canh} (${aiData.ung_dung.sac_thai || ''})` : null}
              />
              {aiData.ung_dung?.vi_du && (
                <div
                  style={{
                    marginTop: '15px',
                    backgroundColor: colors.white,
                    padding: '15px',
                    borderRadius: '8px',
                    border: `1px solid ${colors.border}`,
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: '0 0 5px 0', fontSize: '18px', color: colors.text }}>{aiData.ung_dung.vi_du}</p>
                    <p style={{ margin: 0, fontSize: '15px', color: colors.textMuted }}>{aiData.ung_dung.vi_du_dich}</p>
                  </div>
                  <button
                    onClick={() => speak(aiData.ung_dung.vi_du)}
                    title="Phát âm câu ví dụ"
                    style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '18px', color: colors.textMuted }}
                  >
                    🔊
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <WritingBox word={word} aiData={aiData} activeChar={activeChar} />
    </div>
  );
}