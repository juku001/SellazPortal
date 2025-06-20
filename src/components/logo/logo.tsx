import type { LinkProps } from '@mui/material/Link';

import { mergeClasses } from 'minimal-shared/utils';

import Link from '@mui/material/Link';
import { styled } from '@mui/material/styles';

import { RouterLink } from 'src/routes/components';

import { logoClasses } from './classes';

// ----------------------------------------------------------------------

export type LogoProps = Omit<LinkProps, 'variant'> & {
  isSingle?: boolean;
  disabled?: boolean;
  variant?: 'default' | 'dashboard'; // Custom variant (not MUI's)
};

export function Logo({
  sx,
  disabled,
  className,
  href = '/dashboard',
  isSingle = true,
  variant = 'default',
  ...other
}: LogoProps) {
  const imageSrc =
    variant === 'dashboard' ? '/dashboard_logo.jpg' : '/full_logo.png';
  const altText = variant === 'dashboard' ? 'Dashboard Logo' : 'Main Logo';

  return (
    <LogoRoot
      component={RouterLink}
      href={href}
      aria-label="Logo"
      underline="none"
      className={mergeClasses([logoClasses.root, className])}
      sx={[
        {
          width: isSingle ? 180 : 220,
          height: isSingle ? 60 : 64,
          ...(disabled && { pointerEvents: 'none' }),
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <LogoImage src={imageSrc} alt={altText} />
    </LogoRoot>
  );
}

// ----------------------------------------------------------------------

const LogoRoot = styled(Link)(() => ({
  flexShrink: 0,
  color: 'transparent',
  display: 'inline-flex',
  verticalAlign: 'middle',
}));

const LogoImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'contain',
});
