import { useBoolean } from 'minimal-shared/hooks';

import { Fab } from '@mui/material';

import { PERMISSION_ENUM } from 'src/constants/permission';

import { Iconify } from 'src/components/iconify';

import { useCheckPermission } from 'src/auth/hooks';

import TicketListDrawer from './ticket-list-drawer';

export default function TicketFab() {
  const open = useBoolean();
  const { VIEW_PERMIT } = useCheckPermission({
    VIEW_PERMIT: PERMISSION_ENUM.VIEW_TICKET,
  });
  if (!VIEW_PERMIT) return null;
  return (
    <>
      <Fab
        color="primary"
        onClick={open.onTrue}
        sx={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          width: 'fit-content',
          borderRadius: 99,
          px: 2,
          py: 1,
          height: 'unset',
        }}
      >
        <Iconify icon="material-symbols-light:contact-support" />
        Ticket
      </Fab>
      <TicketListDrawer open={open.value} onClose={open.onFalse} />
    </>
  );
}
