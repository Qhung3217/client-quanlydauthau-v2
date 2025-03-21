'use client';

import type { SetStateAction } from 'react';
import type { SxProps } from '@mui/material';
import type { Ticket } from 'src/types/ticket';

import { useState, useCallback } from 'react';
import { useBoolean } from 'minimal-shared/hooks';

import { Box, Paper, Drawer } from '@mui/material';

import { useGetTickets } from 'src/actions/ticket';

import { TicketList } from '../ticket-list';
import { TicketDetails } from '../ticket-detail';
import { TicketCompose } from '../ticket-compose';

type Props = {
  projectId?: string;
  sx?: SxProps;
};
export default function TicketListView({ projectId: filterProjectId, sx }: Props) {
  const [ticketSelected, setTicketSelected] = useState<Ticket | null>(null);
  const [keywordSearch, setKeywordSearch] = useState('');
  const [page, setPage] = useState(1);
  const [projectId, setProjectId] = useState('');

  const { tickets, ticketsMeta, ticketsLoading, ticketsEmpty } = useGetTickets({
    page,
    perPage: 10,
    keyword: keywordSearch,
    projectId: filterProjectId,
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

  return (
    <Paper
      sx={{
        display: 'flex',
        flexDirection: 'column',
        ...sx,
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', flex: '1 1 auto' }}>
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
          projectId={projectId}
          setProjectId={setProjectId}
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
      <TicketCompose open={openCompose.value} onCloseCompose={openCompose.onFalse} />
    </Paper>
  );
}
