import type { EstimateStatus } from 'src/types/estimate';
import type { LabelColor, LabelProps } from 'src/components/label';

type Return = {
  color: LabelColor;
  label: string;
  desc?: string;
  otherProps?: Omit<LabelProps, 'color' | 'children'>;
};
export const getEstimateStatusLabel = (value: EstimateStatus): Return => {
  switch (value) {
    case 'PENDING':
      return {
        color: 'warning',
        label: 'Chờ duyệt',
      };
    case 'APPROVED':
      return {
        color: 'info',
        label: 'Đã duyệt',
      };

    case 'CANCELED':
      return {
        color: 'error',
        label: 'Đã hủy',
      };

    case 'EDIT_REQUESTED':
      return {
        color: 'warning',
        label: 'Yêu cầu điều chỉnh',
        otherProps: {
          variant: 'filled',
        },
      };

    default:
      return {
        color: 'default',
        label: 'Chưa xác định',
      };
  }
};
