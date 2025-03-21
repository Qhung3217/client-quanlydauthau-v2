'use client';

import type { SetStateAction } from 'react';
import type { SxProps } from '@mui/material';
import type { Ticket } from 'src/types/ticket';

import { useState, useCallback } from 'react';
import { useBoolean } from 'minimal-shared/hooks';

import { Box, Paper, Drawer } from '@mui/material';

import { useGetTickets } from 'src/actions/ticket';
import { PERMISSION_ENUM } from 'src/constants/permission';

import { useCheckPermission } from 'src/auth/hooks';

import { TicketList } from '../ticket-list';
import { TicketDetails } from '../ticket-detail';
import { TicketCompose } from '../ticket-compose';
import { useTicketContext } from '../context/use-ticket-context';

type Props = {
  projectId?: string;
  sx?: SxProps;
};
export default function TicketListView({ projectId: filterProjectId, sx }: Props) {
  const { assignee, project, openCompose: openComposeFromContext, resetState } = useTicketContext();

  const { VIEW_TICKET } = useCheckPermission({
    VIEW_TICKET: PERMISSION_ENUM.VIEW_TICKET,
  });

  const [ticketSelected, setTicketSelected] = useState<Ticket | null>(null);

  const [keywordSearch, setKeywordSearch] = useState('');

  const [page, setPage] = useState(1);

  const [projectId, setProjectId] = useState('');

  const { tickets, ticketsMeta, ticketsLoading, ticketsEmpty } = useGetTickets({
    page,
    perPage: 10,
    keyword: keywordSearch,
    projectId: filterProjectId,
    notFetch: !filterProjectId,
  });

  const openCompose = useBoolean();

  const handleClickTicket = useCallback(
    (tkt: Ticket) => {
      setTicketSelected(tkt);
    },

    []
  );

  const handleChangePage = (event: any, value: SetStateAction<number>) => {
    setPage(value);
  };
  if (!VIEW_TICKET) return null;
  return (
    <Paper
      sx={{
        ...sx,
      }}
    >
      <Box>
        <TicketList
          tickets={tickets}
          isEmpty={ticketsEmpty}
          loading={ticketsLoading}
          onClickTicket={handleClickTicket}
          selectedTicketId={ticketSelected?.id || ''}
          keyword={keywordSearch}
          setKeywordSearch={setKeywordSearch}
          page={page}
          totalPages={ticketsMeta?.totalPages ?? 0}
          handlePageChange={handleChangePage}
          onToggleCompose={openCompose.onToggle}
          projectId={filterProjectId || ''}
          setProjectId={setProjectId}
          hideFilterProject
        />
      </Box>
      <Drawer
        open={!!ticketSelected}
        onClose={() => setTicketSelected(null)}
        anchor="right"
        ModalProps={{
          sx: {
            zIndex: 'var(--layout-nav-zIndex)',
          },
        }}
        slotProps={{
          backdrop: {
            sx: {
              backgroundColor: 'transparent',
            },
          },
        }}
      >
        {ticketSelected && <TicketDetails ticket={ticketSelected} />}
      </Drawer>
      <TicketCompose
        open={openCompose.value || openComposeFromContext}
        onCloseCompose={() => {
          openCompose.onFalse();

          resetState();
        }}
        project={project || undefined}
        emailOrPhone={assignee}
      />
    </Paper>
  );
}
