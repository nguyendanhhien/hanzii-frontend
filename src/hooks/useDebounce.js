// File: frontend/src/hooks/useDebounce.js
import { useEffect, useState } from 'react';

/**
 * Trả về giá trị `value` sau khi nó "đứng yên" trong `delay` ms.
 * Dùng để tránh gọi API dồn dập mỗi lần người dùng gõ phím.
 */
export default function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
