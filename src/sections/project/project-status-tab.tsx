import type { ProjectStatus } from 'src/types/project';

import { Tab, Tabs } from '@mui/material';

import { PROJECT_STATUS } from 'src/constants/project';

type Props = {
  status: ProjectStatus | 'ALL';
  onChange: (tab: ProjectStatus | 'ALL') => void;
};
export default function ProjectStatusTab({ status, onChange }: Props) {
  return (
    <Tabs
      value={status}
      onChange={(event: React.SyntheticEvent, newValue: any) => {
        onChange(newValue);
      }}
      sx={{ mb: { xs: 3, md: 5 } }}
    >
      {['ALL', ...PROJECT_STATUS].map((tab) => {
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
          case 'QUOTED':
            renderLabel = 'Đã duyệt báo giá';
            break;

          case 'CANCELED':
            renderLabel = 'Đã hủy';
            break;
          case 'COMPLETED':
            renderLabel = 'Hoàn thành';
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
