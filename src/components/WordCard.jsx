// File: frontend/src/components/WordCard.jsx
import { useState } from 'react';
import { analyzeWord } from '../api';
import { speak } from '../lib/speak';
import CharacterChips from './CharacterChips';
import WritingBox from './WritingBox';
import { colors, fontStack, shadow } from '../styles';

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
        setError('Tẩu hỏa nhập ma. Vận công thất bại, vui lòng thử lại.');
      })
      .finally(() => setAnalyzing(false));
  };

  return (
    <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', alignItems: 'flex-start', flexWrap: 'wrap', fontFamily: fontStack.vi }}>
      
      {/* CỘT TRÁI: KIẾM TRẬN */}
      <div style={{ flex: '1 1 70%', minWidth: 0, backgroundColor: colors.bgSoft, borderRadius: '4px', padding: '30px', boxShadow: shadow.card, border: `1px solid ${colors.border}` }}>

        {/* HEADER */}
        <div style={{ borderBottom: `1px solid ${colors.border}`, paddingBottom: '20px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              {word.hanzi.split('').map((char, index) => (
                <span key={index} style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: '60px', height: '80px', fontSize: '46px', color: colors.gold, 
                  backgroundColor: colors.bg, border: `1px solid ${colors.accent}`, 
                  borderRadius: '4px', boxShadow: shadow.glowRed, fontFamily: fontStack.hanzi,
                  textShadow: '0 2px 4px rgba(0,0,0,0.8)'
                }}>
                  {char}
                </span>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <span style={{ fontSize: '18px', color: colors.steel, letterSpacing: '1px', fontFamily: fontStack.pinyin }}>[ {word.pinyin} ]</span>
              {aiData?.ngu_am?.han_viet && (
                <span style={{ fontSize: '14px', fontWeight: 'bold', color: colors.text, backgroundColor: colors.accentDark, padding: '4px 12px', borderRadius: '2px', letterSpacing: '1px', border: `1px solid ${colors.accent}`, display: 'inline-block', width: 'fit-content', fontFamily: fontStack.vi }}>
                  ÂM HÁN VIỆT: {aiData.ngu_am.han_viet}
                </span>
              )}
            </div>

            <button
              onClick={() => speak(word.hanzi)}
              title="Truyền Âm"
              style={{ marginLeft: 'auto', border: `1px solid ${colors.border}`, backgroundColor: colors.bg, borderRadius: '4px', padding: '8px 16px', fontSize: '14px', color: colors.steel, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s', fontFamily: fontStack.vi }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = colors.border; e.currentTarget.style.color = colors.text; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = colors.bg; e.currentTarget.style.color = colors.steel; }}
            >
              🔔 Truyền Âm
            </button>
          </div>

          <div style={{ marginTop: '20px' }}>
            <CharacterChips hanzi={word.hanzi} activeChar={activeChar} onSelect={setActiveChar} />
          </div>
        </div>

        {/* NGỘ ĐẠO (AI) */}
        {!aiData ? (
          <div>
            <p style={{ fontSize: '20px', color: colors.text, marginBottom: '25px', letterSpacing: '0.5px' }}>
              <span style={{ color: colors.gold }}>❂ Bản Nguyên:</span> {word.meaning}
            </p>
            <button
              onClick={handleAnalyze} disabled={analyzing}
              style={{ padding: '12px 24px', fontSize: '16px', fontWeight: 'bold', backgroundColor: analyzing ? colors.disabled : colors.accentDark, color: analyzing ? colors.textMuted : colors.gold, border: `1px solid ${analyzing ? colors.border : colors.accent}`, borderRadius: '4px', cursor: analyzing ? 'not-allowed' : 'pointer', boxShadow: analyzing ? 'none' : shadow.glowRed, fontFamily: fontStack.vi, letterSpacing: '1px', transition: 'all 0.3s' }}
              onMouseEnter={(e) => { if (!analyzing) e.currentTarget.style.backgroundColor = colors.accent; }}
              onMouseLeave={(e) => { if (!analyzing) e.currentTarget.style.backgroundColor = colors.accentDark; }}
            >
              {analyzing ? '⏳ Đang vận công chuyển hóa...' : '👁️ Ngộ Đạo Kiếm Ý (AI)'}
            </button>
            {error && (
              <p style={{ marginTop: '15px', color: colors.accent, fontSize: '15px' }}>{error} <button onClick={handleAnalyze} style={{ border: 'none', background: 'none', color: colors.gold, cursor: 'pointer', textDecoration: 'underline', padding: 0, fontFamily: fontStack.vi }}>Vận công lại</button></p>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            <div>
              <h3 style={{ color: colors.gold, margin: '0 0 15px 0', fontSize: '22px', borderBottom: `1px solid ${colors.border}`, paddingBottom: '8px', fontFamily: fontStack.title }}>❂ Bản Nguyên & Chiêu Thức</h3>
              <p style={{ fontSize: '18px', color: colors.text, margin: '0 0 12px 0', lineHeight: 1.6 }}>{aiData.ngu_nghia?.nghia_chi_tiet}</p>
              <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '10px', fontSize: '16px', color: colors.text }}>
                <span style={{ color: colors.textMuted }}>Thuộc tính:</span><span>{aiData.ngu_nghia?.tu_loai || 'Tứ tự tiêu'}</span>
                <span style={{ color: colors.textMuted }}>Biến hóa:</span><span>{aiData.ngu_nghia?.tu_lien_quan || 'Không có'}</span>
              </div>
            </div>

            <div style={{ backgroundColor: colors.bg, padding: '20px', borderRadius: '4px', borderLeft: `4px solid ${colors.accent}`, borderRight: `1px solid ${colors.border}`, borderTop: `1px solid ${colors.border}`, borderBottom: `1px solid ${colors.border}` }}>
              <h3 style={{ color: colors.accent, margin: '0 0 15px 0', fontSize: '20px', letterSpacing: '1px', fontFamily: fontStack.title }}>⚔️ Thực Chiến Tâm Pháp</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '10px', fontSize: '15px', color: colors.text, marginBottom: '15px' }}>
                <span style={{ color: colors.textMuted }}>Kết hợp:</span><span>{aiData.ung_dung?.collocation || 'Tùy cơ ứng biến'}</span>
                <span style={{ color: colors.textMuted }}>Ngữ cảnh:</span><span>{aiData.ung_dung?.ngu_canh ? `${aiData.ung_dung.ngu_canh} (${aiData.ung_dung.sac_thai || ''})` : 'Mọi tình huống'}</span>
              </div>
              {aiData.ung_dung?.vi_du && (
                <div style={{ marginTop: '15px', backgroundColor: colors.bgSoft, padding: '15px', borderRadius: '4px', border: `1px solid ${colors.border}`, display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <div style={{ flex: 1 }}>
                    {/* TRỌNG TÂM SỬA LỖI Ở ĐÂY: Gắn Noto Serif lên trước để ưu tiên chữ Latinh, sau đó mới dùng Khải Thể */}
                    <p style={{ margin: '0 0 8px 0', fontSize: '22px', color: colors.gold, fontFamily: `"Noto Serif", ${fontStack.hanzi}` }}>
                      {aiData.ung_dung.vi_du}
                    </p>
                    <p style={{ margin: 0, fontSize: '16px', color: colors.textMuted, fontStyle: 'italic' }}>{aiData.ung_dung.vi_du_dich}</p>
                  </div>
                  <button onClick={() => speak(aiData.ung_dung.vi_du)} title="Truyền Âm" style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '20px', color: colors.steel }}>🔔</button>
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