import type { BoxProps } from '@mui/material/Box';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = BoxProps & {
  onOpenNav: () => void;
  onOpenTicket?: () => void;
  setKeywordSearch: (keyword: string) => void
};

export function TicketHeader({ onOpenNav, onOpenTicket, sx, setKeywordSearch, ...other }: Props) {
  return (
    <Box
      sx={[
        () => ({
          py: 1,
          mb: 1,
          display: 'flex',
          alignItems: 'center',
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {onOpenTicket && (
        <IconButton onClick={onOpenTicket}>
          <Iconify icon="solar:chat-round-dots-bold" />
        </IconButton>
      )}
    </Box>
  );
}
