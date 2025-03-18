import type { Theme, SxProps } from '@mui/material/styles';

import { styled } from '@mui/material/styles';

// ----------------------------------------------------------------------

type TicketLayoutProps = React.ComponentProps<'div'> & {
  sx?: SxProps<Theme>;
  slots: {
    list: React.ReactNode;
    header: React.ReactNode;
    details: React.ReactNode;
  };
  slotProps?: {
    list?: React.ComponentProps<typeof LayoutList>;
    details?: React.ComponentProps<typeof LayoutDetails>;
    container?: React.ComponentProps<typeof LayoutContainer>;
  };
};

export function TicketLayout({ slots, slotProps, sx, ...other }: TicketLayoutProps) {
  return (
    <LayoutRoot sx={sx} {...other}>
      {slots.header}
      <LayoutContainer {...slotProps?.container}>
        <LayoutList {...slotProps?.list}>{slots.list}</LayoutList>
        <LayoutDetails {...slotProps?.details}>{slots.details}</LayoutDetails>
      </LayoutContainer>
    </LayoutRoot>
  );
}

// ----------------------------------------------------------------------

const LayoutRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  overflow: 'auto',
}));

const LayoutContainer = styled('div')(({ theme }) => ({
  gap: theme.spacing(1),
  display: 'flex',
  flex: '1 1 auto',
  overflow: 'hidden',
  alignItems: 'stretch',
}));

const LayoutList = styled('div')(({ theme }) => ({
  display: 'none',
  flex: '0 0 420px',
  overflow: 'hidden',
  flexDirection: 'column',
  borderRadius: theme.shape.borderRadius * 1.5,
  backgroundColor: theme.vars.palette.background.default,
  [theme.breakpoints.up('md')]: { display: 'flex' },
  border: `0.5px solid #dfe3e8`
}));

const LayoutDetails = styled('div')(({ theme }) => ({
  minWidth: 0,
  display: 'flex',
  flex: '1 1 auto',
  overflow: 'hidden',
  flexDirection: 'column',
  borderRadius: theme.shape.borderRadius * 1.5,
  backgroundColor: theme.vars.palette.background.default,
  border: `0.5px solid #dfe3e8`
}));
