import type { Estimate } from 'src/types/estimate';
import type { ProjectDetails } from 'src/types/project';

import { useState } from 'react';
import { useBoolean } from 'minimal-shared/hooks';

import { Box, Card, Stack, Button, Typography, type CardProps } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { PERMISSION_ENUM } from 'src/constants/permission';

import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';

import { useCheckPermission } from 'src/auth/hooks';

import EstimateItem from '../estimate/estimate-item';
import EstimateDialog from '../estimate/estimate-dialog';
import useProjectActionPermit from './hooks/use-project-action-permit';
import { useTicketContext } from '../ticket/context/use-ticket-context';

type Props = CardProps & {
  project: ProjectDetails;
};

export default function ProjectEstimateList({ project, sx, ...other }: Props) {
  const { setState } = useTicketContext();

  const openDetails = useBoolean();
  const isEstimated = project._count.estimates > 0;

  const [estimateIdView, setEstimateIdView] = useState<string>('');

  const { createEstimatePermit } = useProjectActionPermit(project.status);

  const { APPROVE_ESTIMATE, CANCEL_ESTIMATE, REQUEST_EDIT_ESTIMATE } = useCheckPermission({
    APPROVE_ESTIMATE: PERMISSION_ENUM.APPROVE_ESTIMATE,
    CANCEL_ESTIMATE: PERMISSION_ENUM.CANCEL_ESTIMATE,
    REQUEST_EDIT_ESTIMATE: PERMISSION_ENUM.REQUEST_EDIT_ESTIMATE,
  });

  const isAdmin = !!APPROVE_ESTIMATE || !!CANCEL_ESTIMATE || !!REQUEST_EDIT_ESTIMATE;

  const renderList = () =>
    project.estimates.map((estimate: Estimate | any) => (
      <EstimateItem
        key={estimate.id}
        project={project}
        estimate={estimate}
        detailsClick={() => {
          setEstimateIdView(estimate.id);
          openDetails.onTrue();
        }}
        ticketClick={(p, assignee) =>
          setState({
            project: p,
            assignee,
            openCompose: true,
          })
        }
      />
    ));

  return (
    <Card
      sx={[
        {
          borderRadius: 1,
          border: (theme) => `1px solid ${theme.palette.divider}`,
          p: 2,
          boxShadow: 'none',
          position: 'relative',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Typography fontWeight="bold">{isAdmin ? 'Danh sách dự toán' : 'Dự toán'}</Typography>

      <Stack sx={{ mt: 2 }} />

      {project.estimates.length > 0 ? (
        <Box
          id="estimate-list"
          sx={{
            gap: 3,
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' },
          }}
        >
          {renderList()}
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <EmptyContent title="Không có dự toán" />
          {!isEstimated && createEstimatePermit && (
            <Button
              color="primary"
              component={RouterLink}
              href={paths.project.estimate(project.id)}
              startIcon={<Iconify icon="mdi:paper-edit-outline" />}
              sx={{
                backgroundColor: 'primary.main',
                color: '#fff',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
              }}
            >
              Nhập dự toán
            </Button>
          )}
        </Box>
      )}

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
    </Card>
  );
}
