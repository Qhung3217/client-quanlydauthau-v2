import type { EstimateStatus } from 'src/types/estimate';

import { Tab, Tabs } from '@mui/material';

import { ESTIMATE_STATUSES } from 'src/constants/estimate';

type ProjectStatusTab = EstimateStatus | 'ALL';
type Props = {
  status: ProjectStatusTab;
  onChange: (tab: ProjectStatusTab) => void;
};
export default function EstimateStatusTab({ status, onChange }: Props) {
  return (
    <Tabs
      value={status}
      onChange={(event: React.SyntheticEvent, newValue: any) => {
        onChange(newValue);
      }}
      sx={{
        mb: { xs: 3, md: 5 },
        backgroundColor: 'background.neutral',

        width: 'fit-content',
        maxWidth: 1,
        borderRadius: 1,
        minHeight: 40,
        boxShadow: (theme) => `inset 0px 0px 1px 1px rgba(145 158 171 / 0.2)`,
        '& .MuiTab-root': {
          minHeight: 40,
          py: 0,
          px: 2,
        },
        '& .MuiTabs-flexContainer': {
          gap: 1,
        },
        '& .Mui-selected': {
          background: 'white',
          color: 'black',
          // my: 1,
          borderRadius: 1,
          boxShadow: (theme) => theme.shadows[1],

          border: (theme) => `1px solid ${theme.palette.divider}`,
        },
      }}
      TabIndicatorProps={{
        sx: {
          display: 'none',
        },
      }}
    >
      {(['ALL', ...ESTIMATE_STATUSES] as any).map((tab: ProjectStatusTab) => {
        let renderLabel = 'Tất cả';

        switch (tab) {
          case 'ALL':
            renderLabel = 'Tất cả';
            break;
          case 'PENDING':
            renderLabel = 'Chờ duyệt';
            break;
          case 'APPROVED':
            renderLabel = 'Đã duyệt';
            break;

          case 'EDIT_REQUESTED':
            renderLabel = 'Yêu cầu điều chỉnh';
            break;

          case 'CANCELED':
            renderLabel = 'Đã hủy';
            break;

          default:
            renderLabel = 'Tất cả';
            break;
        }
        return (
          <Tab
            key={tab}
            iconPosition="end"
            value={tab}
            label={renderLabel}
            sx={{ textTransform: 'capitalize' }}
          />
        );
      })}
    </Tabs>
  );
}
