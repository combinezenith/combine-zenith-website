import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';

const useMedia = (queries: string[], values: number[], defaultValue: number): number => {
  const get = useCallback(() => values[queries.findIndex(q => matchMedia(q).matches)] ?? defaultValue, [queries, values, defaultValue]);

  const [value, setValue] = useState<number>(get);

  useEffect(() => {
    const handler = () => setValue(get);
    queries.forEach(q => matchMedia(q).addEventListener('change', handler));
    return () => queries.forEach(q => matchMedia(q).removeEventListener('change', handler));
  }, [queries, get]);

  return value;
};

const useMeasure = <T extends HTMLElement>() => {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, [ref]);

  return [ref, size] as const;
};

const preloadImages = async (urls: string[]): Promise<void> => {
  await Promise.all(
    urls.map(
      src =>
        new Promise<void>(resolve => {
          const img = new Image();
          img.src = src;
          img.onload = img.onerror = () => resolve();
        })
    )
  );
};

interface Item {
  id: string;
  img: string;
  url: string;
  height: number;
}

interface GridItem extends Item {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface MasonryProps {
  items: Item[];
  ease?: string;
  duration?: number;
  stagger?: number;
  animateFrom?: 'bottom' | 'top' | 'left' | 'center' | 'random';
  scaleOnHover?: boolean;
  hoverScale?: number;
  blurToFocus?: boolean;
  colorShiftOnHover?: boolean;
  itemsPerLoad?: number;
}

const Masonry: React.FC<MasonryProps> = ({
  items,
  ease = 'power3.out',
  duration = 0.6,
  stagger = 0.05,
  animateFrom = 'bottom',
  scaleOnHover = true,
  hoverScale = 0.95,
  blurToFocus = true,
  colorShiftOnHover = false,
  itemsPerLoad = 10
}) => {
  const columns = useMedia(
    ['(min-width: 1500px)', '(min-width: 1024px)', '(min-width: 768px)', '(min-width: 640px)'],
    [5, 4, 3, 2],
    2 // Default to 2 columns on mobile
  );

  const [containerRef, { width }] = useMeasure<HTMLDivElement>();
  const [imagesReady, setImagesReady] = useState(false);
  const [visibleCount, setVisibleCount] = useState(itemsPerLoad);
  const [isLoading, setIsLoading] = useState(false);

  const visibleItems = useMemo(() => items.slice(0, visibleCount), [items, visibleCount]);
  const hasMoreItems = visibleCount < items.length;
  const canShowLess = visibleCount > itemsPerLoad;

  const loadMore = () => {
    if (isLoading || !hasMoreItems) return;

    setIsLoading(true);

    // Preload next batch of images
    const nextItems = items.slice(visibleCount, visibleCount + itemsPerLoad);
    preloadImages(nextItems.map(i => i.img)).then(() => {
      setVisibleCount(prev => prev + itemsPerLoad);
      setIsLoading(false);
    });
  };

  const showLess = () => {
    setVisibleCount(itemsPerLoad);
    // Scroll to top of masonry section
    containerRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getInitialPosition = (item: GridItem) => {
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return { x: item.x, y: item.y };

    let direction = animateFrom;
    if (animateFrom === 'random') {
      const dirs = ['top', 'bottom', 'left'];
      direction = dirs[Math.floor(Math.random() * dirs.length)] as typeof animateFrom;
    }

    switch (direction) {
      case 'top':
        return { x: item.x, y: -100 };
      case 'bottom':
        return { x: item.x, y: window.innerHeight + 100 };
      case 'left':
        return { x: -100, y: item.y };
      case 'center':
        return {
          x: containerRect.width / 2 - item.w / 2,
          y: containerRect.height / 2 - item.h / 2
        };
      default:
        return { x: item.x, y: item.y + 50 };
    }
  };

  useEffect(() => {
    preloadImages(visibleItems.map(i => i.img)).then(() => setImagesReady(true));
  }, [visibleItems]);

  const grid = useMemo<GridItem[]>(() => {
    if (!width) return [];
    const colHeights = new Array(columns).fill(0);
    const gap = columns > 2 ? 12 : 8; // Smaller gaps for more compact layout
    const totalGaps = (columns - 1) * gap;
    const columnWidth = (width - totalGaps) / columns;

    return visibleItems.map(child => {
      const col = colHeights.indexOf(Math.min(...colHeights));
      const x = col * (columnWidth + gap);

      // Much smaller heights for compact layout
      const baseHeight = columns > 2 ? child.height / 3 : child.height / 4;
      const height = Math.max(baseHeight, 80); // Even smaller minimum height

      const y = colHeights[col];

      colHeights[col] += height + gap;
      return { ...child, x, y, w: columnWidth, h: height };
    });
  }, [columns, visibleItems, width]);

  const hasMounted = useRef(false);

  useLayoutEffect(() => {
    if (!imagesReady || !containerRef.current) return;

    grid.forEach((item, index) => {
      const selector = `[data-key="${item.id}"]`;
      const animProps = {
        x: item.x,
        y: item.y,
        width: item.w,
        height: item.h
      };

      if (!hasMounted.current) {
        const start = getInitialPosition(item);
        gsap.fromTo(
          selector,
          {
            opacity: 0,
            x: start.x,
            y: start.y,
            width: item.w,
            height: item.h,
            ...(blurToFocus && { filter: 'blur(8px)' })
          },
          {
            opacity: 1,
            ...animProps,
            ...(blurToFocus && { filter: 'blur(0px)' }),
            duration: columns > 2 ? 0.6 : 0.4, // Faster animations
            ease: 'power3.out',
            delay: index * (columns > 2 ? stagger : stagger * 1.5)
          }
        );
      } else {
        gsap.to(selector, {
          ...animProps,
          duration: columns > 2 ? duration * 0.8 : duration * 0.6,
          ease,
          overwrite: 'auto'
        });
      }
    });

    hasMounted.current = true;
  }, [grid, imagesReady, stagger, animateFrom, blurToFocus, duration, ease, columns, getInitialPosition]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleMouseEnter = (id: string, element: HTMLElement) => {
    if (scaleOnHover && window.innerWidth > 768) {
      gsap.to(`[data-key="${id}"]`, {
        scale: hoverScale,
        duration: 0.2,
        ease: 'power2.out'
      });
    }
    if (colorShiftOnHover && window.innerWidth > 768) {
      const overlay = element.querySelector('.color-overlay') as HTMLElement;
      if (overlay) gsap.to(overlay, { opacity: 0.3, duration: 0.2 });
    }
  };

  const handleMouseLeave = (id: string, element: HTMLElement) => {
    if (scaleOnHover && window.innerWidth > 768) {
      gsap.to(`[data-key="${id}"]`, {
        scale: 1,
        duration: 0.2,
        ease: 'power2.out'
      });
    }
    if (colorShiftOnHover && window.innerWidth > 768) {
      const overlay = element.querySelector('.color-overlay') as HTMLElement;
      if (overlay) gsap.to(overlay, { opacity: 0, duration: 0.2 });
    }
  };

  return (
    <div className="w-full">
      <div
        ref={containerRef}
        className="relative w-full"
        style={{
          height: grid.length > 0 ? Math.max(...grid.map(item => item.y + item.h)) : 'auto',
          minHeight: '200px' // Smaller minimum height
        }}
      >
        {grid.map(item => (
          <div
            key={item.id}
            data-key={item.id}
            className="absolute cursor-pointer"
            style={{
              willChange: 'transform, width, height, opacity',
              transform: 'translateZ(0)'
            }}
            onClick={() => window.open(item.url, '_blank', 'noopener')}
            onMouseEnter={e => handleMouseEnter(item.id, e.currentTarget)}
            onMouseLeave={e => handleMouseLeave(item.id, e.currentTarget)}
            onTouchStart={e => {
              if (window.innerWidth <= 768) {
                e.currentTarget.style.opacity = '0.8';
              }
            }}
            onTouchEnd={e => {
              if (window.innerWidth <= 768) {
                e.currentTarget.style.opacity = '1';
              }
            }}
          >
            <div
              className="relative w-full h-full bg-cover bg-center rounded-md md:rounded-lg shadow-xs md:shadow-sm border border-purple-200/10"
              style={{ backgroundImage: `url(${item.img})` }}
            >
              {colorShiftOnHover && (
                <div className="color-overlay absolute inset-0 rounded-md md:rounded-lg bg-gradient-to-tr from-pink-500/30 to-sky-500/30 opacity-0 pointer-events-none" />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Load More / See Less Buttons */}
      <div className="flex justify-center gap-4 mt-6 md:mt-8">
        {canShowLess && (
          <button
            onClick={showLess}
            className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-md text-sm"
          >
            See Less
          </button>
        )}

        {hasMoreItems && (
          <button
            onClick={loadMore}
            disabled={isLoading}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-medium py-2 px-6 rounded-full transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-md text-sm"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Loading...</span>
              </div>
            ) : (
              `Show more`
            )}
          </button>
        )}
      </div>

      {/* Show message when all items are loaded */}
      {!hasMoreItems && items.length > itemsPerLoad && (
        <div className="text-center mt-6">
          <p className="text-purple-300 text-sm font-medium">
            {items.length} partners.
          </p>
        </div>
      )}
    </div>
  );
};

export default Masonry;
