import type { ChangeEvent } from 'react';
import type { Ticket } from 'src/types/ticket';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { Pagination } from '@mui/material';

import useDebounceCallback from 'src/hooks/use-debounce-callback';

import { CONFIG } from 'src/global-config';

import { EmptyContent } from 'src/components/empty-content';

import { TicketItem } from './ticket-item';
import { TicketToolbar } from './ticket-toolbar';
import { TicketItemSkeleton } from './ticket-nav-skeleton';

// ----------------------------------------------------------------------

type Props = {
  isEmpty: boolean;
  loading: boolean;
  tickets: Ticket[];
  selectedTicketId: string;
  onClickTicket: (ticket: Ticket) => void;
  keyword: string;
  setKeywordSearch: (keyword: string) => void;
  page: number;
  totalPages: number;
  handlePageChange: (event: ChangeEvent<unknown>, value: number) => void;
  onToggleCompose: () => void;
  projectId: string;
  setProjectId: (projectId: string) => void;
};

export function TicketList({
  isEmpty,
  loading,
  tickets,
  onClickTicket,
  keyword,
  selectedTicketId,
  setKeywordSearch,
  page,
  totalPages,
  handlePageChange,
  onToggleCompose,
  projectId,
  setProjectId,
}: Props) {
  const debouncedSetKeyword = useDebounceCallback((value: string) => setKeywordSearch(value), 500);

  const handleChange = (value: string) => {
    debouncedSetKeyword(value);
  };

  const renderLoading = () => (
    <Stack sx={{ px: 2, flex: '1 1 auto' }}>
      <TicketItemSkeleton />
    </Stack>
  );

  const renderEmpty = () => (
    <Stack sx={{ px: 2, flex: '1 1 auto' }}>
      <EmptyContent
        title="Danh sách ticket rỗng"
        imgUrl={`${CONFIG.assetsDir}/assets/icons/empty/ic-folder-empty.svg`}
      />
    </Stack>
  );

  const renderList = () =>
    isEmpty ? (
      renderEmpty()
    ) : (
      <Box sx={{ flex: '1 1 auto' }}>
        <Box
          component="ul"
          sx={{
            px: 2,
            pb: 1,
            gap: 0.5,
            overflow: 'auto',
            height: {
              xs: 'calc(100vh - 130px)',
              sm: 'calc(100vh - 180px)',
            },
            scrollbarWidth: 'none',
            '-ms-overflow-style': 'none',
            '-webkit-overflow-scrolling': 'touch',
            '&::-webkit-scrollbar': {
              width: '8px',
              opacity: 0,
              transition: 'opacity 0.3s',
            },
            '&:hover::-webkit-scrollbar': {
              opacity: 1,
            },
          }}
        >
          {tickets.map((ticket, index) => (
            <TicketItem
              key={index}
              ticket={ticket}
              selected={selectedTicketId === ticket.id}
              onClick={() => onClickTicket(ticket)}
            />
          ))}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', my: 2 }}>
          <Pagination count={totalPages} page={page} onChange={handlePageChange} color="primary" />
        </Box>
      </Box>
    );

  const renderSearchBar = () => (
    <TicketToolbar
      setKeywordSearch={handleChange}
      keyword={keyword}
      projectId={projectId}
      setProjectId={setProjectId}
      onToggleCompose={onToggleCompose}
    />
  );

  const renderContent = () => (
    <>
      <Stack sx={{ p: 2 }} id="ticket-searchbar">
        {renderSearchBar()}
      </Stack>

      {loading ? renderLoading() : renderList()}
    </>
  );
  return <>{renderContent()}</>;
}
