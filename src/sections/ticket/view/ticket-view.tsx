'use client';

import type { SetStateAction } from 'react';

import { useBoolean } from 'minimal-shared/hooks';
import { useState, useEffect, useCallback, startTransition } from 'react';

import { useTheme } from '@mui/material/styles';
import { Button, useMediaQuery } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { MainContent } from 'src/layouts/main';
import { PERMISSION_ENUM } from 'src/constants/permission';
import { useGetTicket, useGetTickets } from 'src/actions/ticket';

import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';

import useCheckPermission from 'src/auth/hooks/use-check-permission';

import { TicketLayout } from '../layout';
import { TicketList } from '../ticket-list';
import { TicketHeader } from '../ticket-header';
import { TicketDetails } from '../ticket-detail';
import { TicketCompose } from '../ticket-compose';

const LABEL_INDEX = 'Ticket';

export default function TicketView() {
  const [keywordSearch, setKeywordSearch] = useState('');
  const [page, setPage] = useState(1);

  const { SEND_PERMIT } = useCheckPermission({
    SEND_PERMIT: PERMISSION_ENUM.SEND_TICKET,
  });
  const { tickets, ticketsMeta, ticketsLoading, ticketsEmpty } = useGetTickets({
    page,
    perPage: 10,
    keyword: keywordSearch,
  });

  const router = useRouter();
  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up('md'));

  const openNav = useBoolean();
  const openTicket = useBoolean();
  const openCompose = useBoolean();

  const searchParams = useSearchParams();
  const selectedLabelId = searchParams.get('label') ?? LABEL_INDEX;
  const selectedTicketId = searchParams.get('id') ?? '';

  const firstTicketId = tickets[0]?.id || '';

  const { ticket, ticketLoading, ticketError } = useGetTicket(selectedTicketId);

  const handleClickTicket = useCallback(
    (ticketId: string) => {
      if (!mdUp) {
        openTicket.onFalse();
      }

      const redirectPath =
        selectedLabelId !== LABEL_INDEX
          ? `${paths.ticket.root}?id=${ticketId}&label=${selectedLabelId}`
          : `${paths.ticket.root}?id=${ticketId}`;

      startTransition(() => {
        router.push(redirectPath);
      });
    },

    [mdUp, openTicket, router, selectedLabelId]
  );

  const handleChangePage = (event: any, value: SetStateAction<number>) => {
    console.log(123);

    setPage(value);
  };

  const handleToggleCompose = useCallback(() => {
    if (openNav.value) {
      openNav.onFalse();
    }
    openCompose.onToggle();
  }, [openCompose, openNav]);

  useEffect(() => {
    if (!selectedTicketId && firstTicketId) {
      handleClickTicket(firstTicketId);
    }
  }, [firstTicketId, handleClickTicket, selectedTicketId]);

  return (
    <>
      <MainContent>
        <TicketLayout
          sx={{
            p: 1,
            borderRadius: 2,
            flex: '1 1 auto',
            bgcolor: 'background.neutral',
          }}
          slots={{
            header: (
              <TicketHeader
                onOpenNav={openNav.onTrue}
                onOpenTicket={ticketsEmpty ? undefined : openTicket.onTrue}
                sx={{ display: { md: 'none' } }}
                setKeywordSearch={setKeywordSearch}
              />
            ),
            list: (
              <TicketList
                tickets={tickets}
                isEmpty={ticketsEmpty}
                loading={ticketsLoading}
                openTicket={openTicket.value}
                onCloseTicket={openTicket.onFalse}
                onClickTicket={handleClickTicket}
                selectedLabelId={selectedLabelId}
                selectedTicketId={selectedTicketId}
                setKeywordSearch={setKeywordSearch}
                page={page}
                totalPages={ticketsMeta?.totalPages ?? 0}
                handlePageChange={handleChangePage}
                onToggleCompose={handleToggleCompose}
              />
            ),
            details: ticket ? (
              <TicketDetails
                ticket={ticket}
                isEmpty={ticketsEmpty}
                error={ticketError?.message}
                loading={ticketsLoading || ticketLoading}
              />
            ) : (
              <EmptyContent
                title="Không có ticket nào được chọn"
                imgUrl={`${CONFIG.assetsDir}/assets/icons/empty/ic-email-selected.svg`}
                action={
                  <>
                    {SEND_PERMIT && (
                      <Button
                        color="inherit"
                        variant="contained"
                        onClick={handleToggleCompose}
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          mt: 2,
                        }}
                        endIcon={<Iconify icon="solar:pen-bold" />}
                      >
                        Tạo Ticket
                      </Button>
                    )}
                  </>
                }
              />
            ),
          }}
        />
      </MainContent>
      {openCompose.value && <TicketCompose onCloseCompose={openCompose.onFalse} />}
    </>
  );
}
