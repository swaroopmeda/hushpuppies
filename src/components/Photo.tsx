import Image from 'next/image';
import type { CSSProperties } from 'react';
import type { Media } from '@/lib/data';

type PhotoProps = {
  media: Media;
  sizes: string;
  alt?: string;
  eager?: boolean;
  priority?: boolean;
  className?: string;
  // Keeps the intrinsic ratio instead of filling a positioned parent.
  intrinsic?: boolean;
  style?: CSSProperties;
};

// next/image with the focal point and blur placeholder recorded for each photo.
export function Photo({ media, sizes, alt, eager, priority, className, intrinsic, style }: PhotoProps) {
  const position = `${(media.focalX * 100).toFixed(1)}% ${(media.focalY * 100).toFixed(1)}%`;
  const placeholder: CSSProperties = {
    backgroundColor: media.color,
    backgroundSize: 'cover',
    backgroundPosition: position,
    backgroundRepeat: 'no-repeat',
    backgroundImage: media.blurDataUrl ? `url("${media.blurDataUrl}")` : undefined,
  };
  const shared = {
    src: media.url,
    alt: alt ?? media.alt,
    sizes,
    className,
    priority,
    loading: priority ? undefined : eager ? ('eager' as const) : ('lazy' as const),
  };

  if (intrinsic) {
    return (
      <Image
        {...shared}
        width={media.width}
        height={media.height}
        style={{ width: '100%', height: 'auto', ...placeholder, ...style }}
      />
    );
  }
  return <Image {...shared} fill style={{ objectFit: 'cover', objectPosition: position, ...placeholder, ...style }} />;
}
