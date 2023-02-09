import { useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { animateScroll, scroller } from 'react-scroll';

export default function useHashScroll(
  resolveAnchor: (hash: string) => { anchor: string; offset?: number } | undefined,
  bouncing = true,
) {
  const { pathname, hash, search } = useLocation();

  useEffect(() => {
    scroll(hash);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const bouncingScroll = useCallback(
    (elementName: string, offset?: number) => {
      const elements = document.getElementsByName(elementName);
      if (elements.length === 0) return;

      const { y } = elements[0].getBoundingClientRect();
      const currentY = window.pageYOffset;
      if (!bouncing) {
        scroller.scrollTo(elementName, {
          duration: 600,
          delay: 0,
          smooth: 'easeOutCubic',
          offset,
        });
        return;
      }

      if (currentY < y) {
        // scroll down
        animateScroll.scrollTo(currentY - 256, {
          duration: 200,
          delay: 0,
          smooth: 'easeInCubic',
        });
      } else {
        // scroll up
        animateScroll.scrollTo(currentY + 256, {
          duration: 200,
          delay: 0,
          smooth: 'easeInCubic',
        });
      }

      setTimeout(() => {
        scroller.scrollTo(elementName, {
          duration: 600,
          delay: 0,
          smooth: 'easeOutCubic',
          offset,
        });
      }, 200);
    },
    [bouncing],
  );

  const scroll = useCallback(
    (hash: string) => {
      if (!hash) return;

      const config = resolveAnchor(hash);
      if (!config) return;

      const { anchor, offset } = config;
      anchor && bouncingScroll(anchor, offset);
    },
    [bouncingScroll, resolveAnchor],
  );

  const toPath = useCallback((value: string) => `${pathname}${search ?? ''}${value}`, [pathname, search]);

  return { scroll, hash, toPath };
}
