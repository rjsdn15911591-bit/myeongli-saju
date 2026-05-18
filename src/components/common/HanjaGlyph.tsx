interface HanjaGlyphProps {
  char: string;
  size?: 'hero' | 'tile' | 'icon' | 'display';
  opacity?: number;
  className?: string;
  style?: React.CSSProperties;
}

const SIZE_MAP = {
  hero:    { fontSize: '64px',  fontWeight: 300 },
  tile:    { fontSize: '120px', fontWeight: 300 },
  icon:    { fontSize: '36px',  fontWeight: 300 },
  display: { fontSize: '48px',  fontWeight: 300 },
};

export default function HanjaGlyph({ char, size = 'icon', opacity = 1, className, style }: HanjaGlyphProps) {
  const sizeStyle = SIZE_MAP[size];
  return (
    <span
      aria-hidden="true"
      role="presentation"
      className={className}
      style={{
        fontFamily: "'WenKaiKR', serif",
        lineHeight: 1,
        display: 'inline-block',
        opacity,
        ...sizeStyle,
        ...style,
      }}
    >
      {char}
    </span>
  );
}
