// File: frontend/src/App.jsx
import { useState, useEffect } from 'react';

function App() {
  const [words, setWords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  // State mới: Lưu ID của từ vựng đang được AI xử lý để hiện hiệu ứng xoay xoay/chờ đợi
  const [analyzingId, setAnalyzingId] = useState(null); 

  const fetchWords = (query = '') => {
    fetch(`https://hanzii-backend-api.onrender.com/api/words?q=${query}`) 
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'success') {
          setWords(data.data);
        }
      })
      .catch((error) => console.error("❌ Lỗi gọi API:", error));
  };

  useEffect(() => {
    fetchWords();
  }, []);

  const handleSearch = () => {
    fetchWords(searchTerm);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') fetchWords(searchTerm);
  };

  // HÀM MỚI: Gọi API AI của Backend
  const handleAnalyzeAI = (wordId) => {
    setAnalyzingId(wordId); // Bật trạng thái "Đang suy nghĩ" cho thẻ này

    fetch(`https://hanzii-backend-api.onrender.com/api/words/${wordId}/analyze`, {
      method: 'POST'
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          // Cập nhật lại dữ liệu của từ vựng này trên màn hình mà không cần load lại trang
          setWords(prevWords => prevWords.map(w => 
            w._id === wordId ? { ...w, ai_details: data.data } : w
          ));
        } else {
          alert("Lỗi phân tích: " + data.message);
        }
      })
      .catch(err => console.error(err))
      .finally(() => {
        setAnalyzingId(null); // Tắt trạng thái "Đang suy nghĩ"
      });
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', color: '#2c3e50' }}>📚 Từ điển Hanzii Mini (Có AI)</h1>
      
      {/* THANH TÌM KIẾM */}
      <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
        <input 
          type="text" 
          placeholder="Nhập Hán tự, Pinyin hoặc Tiếng Việt..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{ padding: '12px', width: '300px', fontSize: '16px', borderRadius: '8px 0 0 8px', border: '1px solid #ccc', outline: 'none' }}
        />
        <button 
          onClick={handleSearch}
          style={{ padding: '12px 20px', fontSize: '16px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '0 8px 8px 0', cursor: 'pointer' }}
        >
          Tìm kiếm
        </button>
      </div>
      
      {/* HIỂN THỊ KẾT QUẢ */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center', marginTop: '30px' }}>
        {words.length === 0 ? (
          <p>Không tìm thấy từ vựng nào...</p>
        ) : (
          words.map((word) => (
            <div key={word._id} style={{ 
              backgroundColor: 'white', border: '1px solid #e0e0e0', padding: '20px', 
              borderRadius: '12px', minWidth: '250px', maxWidth: '300px', textAlign: 'center',
              boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column'
            }}>
              <h2 style={{ margin: '0 0 10px 0', fontSize: '2.5em', color: '#e74c3c' }}>{word.hanzi}</h2>
              <p style={{ margin: '0 0 5px 0', color: '#7f8c8d', fontSize: '1.2em' }}>{word.pinyin}</p>
              <p style={{ margin: '0 0 15px 0', fontWeight: 'bold', color: '#34495e' }}>{word.meaning}</p>
              
              {/* KHU VỰC AI */}
              <div style={{ marginTop: 'auto' }}>
                {word.ai_details ? (
                  // Nếu đã có dữ liệu AI (từ DB hoặc vừa generate xong) thì hiển thị
                  <div style={{ 
                    textAlign: 'left', backgroundColor: '#f0f8ff', padding: '12px', 
                    borderRadius: '8px', fontSize: '0.9em', color: '#2c3e50',
                    whiteSpace: 'pre-line' /* Quan trọng: Giữ lại các dấu xuống dòng của AI */
                  }}>
                    <strong>🤖 Trợ lý AI:</strong><br/>
                    {word.ai_details}
                  </div>
                ) : (
                  // Nếu chưa có, hiển thị nút bấm
                  <button 
                    onClick={() => handleAnalyzeAI(word._id)}
                    disabled={analyzingId === word._id}
                    style={{
                      width: '100%', padding: '10px', fontSize: '14px', fontWeight: 'bold',
                      backgroundColor: analyzingId === word._id ? '#bdc3c7' : '#9b59b6', // Đổi màu khi đang load
                      color: 'white', border: 'none', borderRadius: '8px',
                      cursor: analyzingId === word._id ? 'not-allowed' : 'pointer',
                      transition: 'background-color 0.3s'
                    }}
                  >
                    {analyzingId === word._id ? '⏳ AI đang phân tích...' : '✨ Phân tích bằng AI'}
                  </button>
                )}
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;