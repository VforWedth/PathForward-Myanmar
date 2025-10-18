import Image from 'next/image';
import Link from 'next/link';
import logo from '@/media/logo.png';
import { brandMessaging } from '@/config/brand';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  linkTo?: string;
  className?: string;
  textClassName?: string;
}

const sizeMap = {
  sm: { width: 32, height: 32, text: 'text-lg' },
  md: { width: 40, height: 40, text: 'text-xl' },
  lg: { width: 48, height: 48, text: 'text-2xl' },
  xl: { width: 64, height: 64, text: 'text-3xl' },
};

export function Logo({
  size = 'md',
  showText = true,
  linkTo = '/',
  className = '',
  textClassName = '',
}: LogoProps) {
  const { width, height, text } = sizeMap[size];

  const content = (
    <div className={`flex items-center gap-2 ${className}`}>
      <Image
        src={logo}
        alt={brandMessaging.name}
        width={width}
        height={height}
        className="object-contain"
        priority
      />
      {showText && (
        <span
          className={`font-bold bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-primary-light)] text-transparent bg-clip-text ${text} ${textClassName}`}
        >
          {brandMessaging.name}
        </span>
      )}
    </div>
  );

  if (linkTo) {
    return (
      <Link href={linkTo} className="inline-flex items-center transition hover:opacity-80">
        {content}
      </Link>
    );
  }

  return content;
}

export function LogoIcon({ size = 'md', className = '' }: Pick<LogoProps, 'size' | 'className'>) {
  const { width, height } = sizeMap[size];

  return (
    <Image
      src={logo}
      alt={brandMessaging.name}
      width={width}
      height={height}
      className={`object-contain ${className}`}
      priority
    />
  );
}
