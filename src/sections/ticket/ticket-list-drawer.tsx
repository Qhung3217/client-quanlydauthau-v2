'use client';

import type { SetStateAction } from 'react';
import type { Ticket } from 'src/types/ticket';

import { useState, useCallback } from 'react';
import { useBoolean } from 'minimal-shared/hooks';

import { Box, Drawer } from '@mui/material';

import { useGetTickets } from 'src/actions/ticket';

import { TicketList } from './ticket-list';
import { TicketDetails } from './ticket-detail';
import { TicketCompose } from './ticket-compose';

type Props = {
  open: boolean;
  onClose: () => void;
};
export default function TicketListDrawer({ open, onClose }: Props) {
  const [ticketSelected, setTicketSelected] = useState<Ticket | null>(null);
  const [keywordSearch, setKeywordSearch] = useState('');
  const [projectId, setProjectId] = useState('');
  const [page, setPage] = useState(1);

  const { tickets, ticketsMeta, ticketsLoading, ticketsEmpty } = useGetTickets({
    page,
    perPage: 10,
    keyword: keywordSearch,
    projectId,
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

  //   useEffect(() => {
  //     if (!selectedTicketId && firstTicketId) {
  //       handleClickTicket(firstTicketId);
  //     }
  //   }, [firstTicketId, handleClickTicket, selectedTicketId]);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          height: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          maxWidth: 500,
          width: '90%',
        },
      }}
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
    </Drawer>
  );
}
