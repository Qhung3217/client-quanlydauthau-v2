import type { ChangeEvent } from 'react';
import type { Ticket } from 'src/types/ticket';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { Button, Pagination } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';

import useDebounceCallback from 'src/hooks/use-debounce-callback';

import { CONFIG } from 'src/global-config';

import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';

import { TicketItem } from './ticket-item';
import { TicketItemSkeleton } from './ticket-nav-skeleton';

// ----------------------------------------------------------------------

type Props = {
  isEmpty: boolean;
  loading: boolean;
  tickets: Ticket[];
  selectedTicketId: string;
  onClickTicket: (ticket: Ticket) => void;
  setKeywordSearch: (keyword: string) => void;
  page: number;
  totalPages: number;
  handlePageChange: (event: ChangeEvent<unknown>, value: number) => void;
  onToggleCompose: () => void;
};

export function TicketList({
  isEmpty,
  loading,
  tickets,
  onClickTicket,
  selectedTicketId,
  setKeywordSearch,
  page,
  totalPages,
  handlePageChange,
  onToggleCompose,
}: Props) {
  const debouncedSetKeyword = useDebounceCallback((value: string) => setKeywordSearch(value), 500);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSetKeyword(event.target.value);
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
    <Box sx={{ display: 'flex', flex: 1, gap: 1, mt: 1 }}>
      <TextField
        placeholder="Tìm kiếm mã, tiêu đề ticket..."
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          },
        }}
        onChange={handleChange}
        fullWidth
        size="small"
      />
      <Button
        color="inherit"
        variant="contained"
        onClick={onToggleCompose}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: 40,
          minWidth: 40,
        }}
      >
        <Iconify icon="solar:pen-bold" />
      </Button>
    </Box>
  );

  const renderContent = () => (
    <>
      <Stack sx={{ p: 2 }}>{renderSearchBar()}</Stack>

      {loading ? renderLoading() : renderList()}
    </>
  );
  return <>{renderContent()}</>;
}
