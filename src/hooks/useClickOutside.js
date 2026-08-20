// File: frontend/src/hooks/useClickOutside.js
import { useEffect } from 'react';

/**
 * Gọi `onOutside` khi người dùng click ra ngoài phần tử được `ref` trỏ tới.
 * Trước đây dropdown gợi ý chỉ đóng khi bấm Enter/chọn 1 mục — click ra
 * ngoài không làm gì cả, gây cảm giác UI "kẹt".
 */
export default function useClickOutside(ref, onOutside) {
  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        onOutside();
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [ref, onOutside]);
}
