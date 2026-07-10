'use client';

import { useEffect, useState } from 'react';
import { getStoreUrl, PLAY_STORE_URL } from '@/lib/app-store-links';

export function useStoreUrl() {
  const [storeUrl, setStoreUrl] = useState(PLAY_STORE_URL);

  useEffect(() => {
    setStoreUrl(getStoreUrl(navigator.userAgent));
  }, []);

  return storeUrl;
}
