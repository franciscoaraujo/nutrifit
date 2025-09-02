'use client';

import { useEffect, useState } from 'react';
import Header from './Header';
import SafeHeader from './SafeHeader';

const HeaderWrapper = () => {
  const [hasClerk, setHasClerk] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setHasClerk(!!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
  }, []);

  // During SSR or when Clerk is not available, use SafeHeader
  if (!isClient || !hasClerk) {
    return <SafeHeader />;
  }

  // On client side with Clerk available, use full Header
  return <Header />;
};

export default HeaderWrapper;