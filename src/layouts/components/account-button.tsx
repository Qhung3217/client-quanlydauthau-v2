import type { IconButtonProps } from '@mui/material/IconButton';

import { m } from 'framer-motion';

import NoSsr from '@mui/material/NoSsr';
import Avatar from '@mui/material/Avatar';
import SvgIcon from '@mui/material/SvgIcon';
import { Box, Typography } from '@mui/material';

import { varTap, varHover, AnimateBorder, transitionTap } from 'src/components/animate';

// ----------------------------------------------------------------------

export type AccountButtonProps = IconButtonProps & {
  photoURL: string;
  displayName: string;
  name: string;
  roleName: string
};

export function AccountButton({ photoURL, displayName, name, roleName, sx, ...other }: AccountButtonProps) {
  const renderFallback = () => (
    <Avatar
      sx={[
        (theme) => ({
          width: 40,
          height: 40,
          border: `solid 2px ${theme.vars.palette.background.default}`,
        }),
      ]}
    >
      <SvgIcon>
        <circle cx="12" cy="6" r="4" fill="currentColor" />
        <path
          fill="currentColor"
          d="M20 17.5c0 2.485 0 4.5-8 4.5s-8-2.015-8-4.5S7.582 13 12 13s8 2.015 8 4.5"
          opacity="0.5"
        />
      </SvgIcon>
    </Avatar>
  );

  return (
    <Box
      component={m.button}
      whileTap={varTap(0.96)}
      whileHover={varHover(1.04)}
      transition={transitionTap()}
      aria-label="Account button"
      id="account-button"
      sx={[
        {
          p: 0,
          display: "flex",
          border: "none",
          bgcolor: "#fff",
          cursor: "pointer",
          ":hover": { bgcolor: "grey.300" },
          padding: 1,
          borderRadius: 1
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <NoSsr fallback={renderFallback()}>
        <AnimateBorder
          sx={{ p: '3px', borderRadius: '50%', width: 40, height: 40 }}
          slotProps={{
            primaryBorder: { size: 60, width: '1px', sx: { color: 'primary.main' } },
            secondaryBorder: { sx: { color: 'warning.main' } },
          }}
        >
          <Avatar src={photoURL} alt={displayName} sx={{ width: 1, height: 1 }}>
            {displayName?.charAt(0).toUpperCase()}
          </Avatar>
        </AnimateBorder>
      </NoSsr>
      <Box display="flex" flexDirection="column" marginLeft={1}>
        <Typography variant="subtitle2" noWrap>
          {name}
        </Typography>
        <Typography variant="caption">
          ({roleName})
        </Typography>
      </Box>
    </Box>
  );
}
