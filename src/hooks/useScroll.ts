import { useEffect, useRef, useState } from 'react';

import usePrevious from './usePrevious';
import { useWindowSize } from './useWindowSize';

export default function useScroll<T extends HTMLElement>() {
  const targetRef = useRef<T>(null);
  const [rect, setRect] = useState({} as DOMRect);

  const { height, width } = useWindowSize();
  const oldValue = usePrevious({ height, width });

  useEffect(() => {
    if (oldValue?.height !== height || oldValue?.width !== width) {
      targetRef.current && setRect(targetRef.current.getBoundingClientRect());
    }
  }, [height, oldValue, width]);

  useEffect(() => {
    const handler = () => {
      targetRef.current && setRect(targetRef.current.getBoundingClientRect());
    };

    window.addEventListener('scroll', handler, {
      capture: false,
      passive: true,
    });

    return () => {
      window.removeEventListener('scroll', handler);
    };
  }, [targetRef]);

  return { rect, ref: targetRef };
}
