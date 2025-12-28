'use client';

import { useEffect } from 'react';
import { usePush } from '@/lib/usePush';

export function PushNotificationProvider() {
  const { isSupported, isSubscribed, isLoading, error, requestPermission } = usePush();

  useEffect(() => {
    // Auto-request permission on first visit
    if (isSupported && !isSubscribed && !isLoading) {
      // Show a custom prompt instead of auto-requesting
      // This is better UX than auto-requesting
    }
  }, [isSupported, isSubscribed, isLoading]);

  // This component doesn't render anything visible
  // It just handles push notification setup
  return null;
} 