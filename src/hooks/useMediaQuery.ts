import { useEffect, useState } from 'react';
import { isBrowser } from 'react-device-detect';

import { MEDIA_WIDTHS } from '../constants/media';

export function useMedia(query: string, defaultState = false) {
  const [state, setState] = useState(isBrowser ? () => window.matchMedia(query).matches : defaultState);

  useEffect(() => {
    let mounted = true;
    const mql = window.matchMedia(query);
    const onChange = () => {
      if (!mounted) {
        return;
      }
      setState(!!mql.matches);
    };

    mql.addEventListener('change', onChange);
    setState(mql.matches);

    return () => {
      mounted = false;
      mql.removeEventListener('change', onChange);
    };
  }, [query]);

  return state;
}

export function useMediaQueryMaxWidth(size: keyof typeof MEDIA_WIDTHS) {
  return useMedia(`(max-width: ${MEDIA_WIDTHS[size]}px)`);
}
