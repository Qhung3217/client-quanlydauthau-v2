
import type { Estimate, EstimateDetails } from "src/types/estimate";

import { useState } from "react";
import { useBoolean } from "minimal-shared/hooks";

import { Box, Card, Stack, Typography, type CardProps } from "@mui/material";

import { PERMISSION_ENUM } from "src/constants/permission";

import { EmptyContent } from "src/components/empty-content";

import { useCheckPermission } from "src/auth/hooks";

import EstimateItem from "../estimate/estimate-item";
import EstimateDialog from "../estimate/estimate-dialog";

type Props = CardProps & {
  estimates: EstimateDetails[]
}

export default function ProjectEstimateList({ estimates, sx, ...other }: Props) {
  const openDetails = useBoolean();

  const [estimateIdView, setEstimateIdView] = useState<string>('');

  const { APPROVE_ESTIMATE, CANCEL_ESTIMATE, REQUEST_EDIT_ESTIMATE } = useCheckPermission({
    APPROVE_ESTIMATE: PERMISSION_ENUM.APPROVE_ESTIMATE,
    CANCEL_ESTIMATE: PERMISSION_ENUM.CANCEL_ESTIMATE,
    REQUEST_EDIT_ESTIMATE: PERMISSION_ENUM.REQUEST_EDIT_ESTIMATE,
  });

  const isAdmin = !!APPROVE_ESTIMATE || !!CANCEL_ESTIMATE || !!REQUEST_EDIT_ESTIMATE;

  const renderList = () =>
    estimates.map((estimate: Estimate | any) => (
      <EstimateItem
        key={estimate.id}
        estimate={estimate}
          detailsClick={() => {
          setEstimateIdView(estimate.id);
          openDetails.onTrue();
        }}
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
      <Typography fontWeight="bold">{ isAdmin ? "Danh sách dự toán" : "Dự toán"}</Typography>

      <Stack sx={{ mt: 2 }} />

      {estimates.length > 0 ?
        <Box
          sx={{
            gap: 3,
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' },
          }}
        >
        { renderList() }
        </Box> :
        <EmptyContent title="Không có dự toán"
      />}

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
