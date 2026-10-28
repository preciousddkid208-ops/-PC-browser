import { useState, useEffect } from 'react';

export type OrientationMode = 'portrait' | 'landscape';

export function useOrientation(): OrientationMode {
  const [orientation, setOrientation] = useState<OrientationMode>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
    }
    return 'portrait';
  });

  useEffect(() => {
    const handleResize = () => {
      const isLandscape = window.innerWidth > window.innerHeight;
      setOrientation(isLandscape ? 'landscape' : 'portrait');
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return orientation;
}
