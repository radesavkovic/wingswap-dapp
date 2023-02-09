import { useEffect, useRef, useState } from 'react';

import usePrevious from './usePrevious';
import { useWindowSize } from './useWindowSize';

export default function useComponentSize<T extends HTMLElement>() {
  const targetRef = useRef<T>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const { width, height } = useWindowSize();
  const oldValue = usePrevious({ height, width });

  useEffect(() => {
    if (oldValue?.height !== height || oldValue?.width !== width) {
      targetRef.current &&
        setDimensions({
          width: targetRef.current.offsetWidth,
          height: targetRef.current.offsetHeight,
        });
    }
  }, [height, oldValue, width]);

  return { dimensions, ref: targetRef };
}
