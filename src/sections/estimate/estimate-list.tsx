'use client';

import type { EstimateStatus } from 'src/types/estimate';

import { useState } from 'react';
import { useBoolean } from 'minimal-shared/hooks';

import { Box, Pagination, paginationClasses } from '@mui/material';

import { useGetEstimates } from 'src/actions/estimate';

import { EmptyContent } from 'src/components/empty-content';
import TableQuickFilter from 'src/components/data-table/table-quick-filter';

import EstimateItem from './estimate-item';
import EstimateStatusTab from './estimate-tab';
import EstimateDialog from './estimate-dialog';
import EstimateListSkeleton from './estimate-list-skeleton';
import useEstimateActions from './hooks/use-estimate-actions';

export default function EstimateList() {
  const [query, setQuery] = useState('');

  const [estimateIdView, setEstimateIdView] = useState<string>('');

  const [selectedRowId, setSelectedRowId] = useState<string>('');

  const [page, setPage] = useState(1);

  const [status, setStatus] = useState<EstimateStatus | 'ALL'>('ALL');

  const openDetails = useBoolean();

  const deleting = useBoolean();

  const { onApprove, onReject, onRequestEdit, renderConfirmDialog } = useEstimateActions();

  const { estimates, estimatesMeta, estimatesEmpty, estimatesLoading } = useGetEstimates({
    page,
    keyword: query,
    ...(status !== 'ALL' && {
      statuses: status,
    }),
  });

  const renderLoading = () => <EstimateListSkeleton />;

  const renderList = () =>
    estimates.map((estimate) => (
      <EstimateItem
        key={estimate.id}
        estimate={estimate}
        detailsClick={() => {
          setEstimateIdView(estimate.id);
          openDetails.onTrue();
        }}
        approveClick={() => onApprove({ id: estimate.id, name: estimate.name })}
        rejectClick={() => onReject({ id: estimate.id, name: estimate.name })}
        requestEditClick={() => onRequestEdit({ id: estimate.id, name: estimate.name })}
      />
    ));

  return (
    <Box>
      <Box
        sx={{
          gap: 3,
          display: 'flex',
          mb: { xs: 3, md: 5 },
          justifyContent: 'space-between',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-end', sm: 'center' },
        }}
      >
        <TableQuickFilter value={query} onChange={setQuery} onReset={() => setQuery('')} />
      </Box>
      <EstimateStatusTab status={status} onChange={setStatus} />
      <Box
        sx={{
          gap: 3,
          display: 'grid',
          gridTemplateColumns: 'repeat(1, 1fr)',
        }}
      >
        {estimatesLoading && !estimatesEmpty ? renderLoading() : renderList()}
      </Box>
      {!estimatesLoading && estimatesEmpty && <EmptyContent title="Bạn chưa tạo dự toán nào" />}
      {!estimatesEmpty && (
        <Pagination
          count={estimatesMeta?.totalPages || 0}
          page={page}
          onChange={(event, newPage) => setPage(newPage)}
          sx={{
            mt: { xs: 5, md: 8 },
            [`& .${paginationClasses.ul}`]: { justifyContent: 'center' },
          }}
        />
      )}

      {renderConfirmDialog()}

      <EstimateDialog
        open={openDetails.value}
        onClose={() => {
          openDetails.onFalse();

          setTimeout(() => {
            setEstimateIdView('');
          }, 300);
        }}
        estimateId={estimateIdView}
      />
    </Box>
  );
}
