import { useMemo } from 'react';

import { MEDIA_WIDTHS } from '../constants/media';

type BreakPointKey = keyof typeof MEDIA_WIDTHS;

export default function useBreakPoint(width: number) {
  return useMemo(() => {
    return (Object.keys(MEDIA_WIDTHS) as BreakPointKey[]).reduce(
      (memo, key) => {
        if (MEDIA_WIDTHS[key] >= width) memo[key] = true;
        return memo;
      },
      { upToExtraSmall: false, upToSmall: false, upToMedium: false, upToLarge: false },
    );
  }, [width]);
}
