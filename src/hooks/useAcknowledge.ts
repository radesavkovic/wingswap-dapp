import { useState } from 'react';

export default function useAcknowledge(key: string): [boolean, () => void] {
  const isAcknowledged = localStorage.getItem(key);
  const [acknowledged, setAcknowledged] = useState(!!isAcknowledged);

  const acknowledge = () => {
    setAcknowledged(true);
    localStorage.setItem(key, 'true');
  };

  return [acknowledged, acknowledge];
}
