'use client';

import Link from 'next/link';
import { event as gaEvent } from '@/lib/gtag';

export default function ShopButton({
  href,
  className,
  children
}: {
  href: string;
  className: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => gaEvent('payhip_click', { location: 'home_cta' })}
      className={className}
    >
      {children}
    </Link>
  );
}
