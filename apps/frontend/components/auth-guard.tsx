'use client';

import { redirect, usePathname } from 'next/navigation';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (typeof window !== 'undefined' && !localStorage.getItem('cgm_token')) {
    redirect(`/login?redirect=${encodeURIComponent(pathname)}`);
  }

  return <>{children}</>;
}
