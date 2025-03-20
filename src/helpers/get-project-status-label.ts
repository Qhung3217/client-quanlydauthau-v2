import type { LabelColor, LabelProps } from 'src/components/label';

type ProjectStatusConfigReturn = {
  color: LabelColor;
  label: string;
  desc?: string;
  otherProps?: Omit<LabelProps, 'color' | 'children'>;
};
export const getProjectStatusConfig = (value: string): ProjectStatusConfigReturn => {
  switch (value) {
    case 'PENDING':
      return {
        color: 'warning',
        label: 'Chờ duyệt',
        desc: 'Dự án đang chờ duyệt',
      };
    case 'APPROVED':
      return {
        color: 'info',
        label: 'Đã duyệt',
        desc: 'Dự án đã được duyệt và đang được nhận dự toán',
      };
    // case 'QUOTED':
    //   return {
    //     color: 'info',
    //     label: 'Đã duyệt báo giá',
    //     desc: 'Chủ dự án đã duyệt báo giá',
    //     otherProps: {
    //       variant: 'filled',
    //     },
    //   };
    case 'CANCELED':
      return {
        color: 'error',
        label: 'Đã hủy',
        desc: 'Dự án đã bị hủy',
      };
    case 'COMPLETED':
      return {
        color: 'success',
        label: 'Hoàn thành',
        desc: 'Dự án đã hoàn thành',
      };
    case 'EDIT_REQUESTED':
      return {
        color: 'warning',
        label: 'Yêu cầu điều chỉnh',
        otherProps: {
          variant: 'filled',
        },
      };
    case 'BUDGET_APPROVED':
      return {
        color: 'success',
        label: 'Đã duyệt dự toán',
        desc: 'Dự án đã được duyệt dự toán',
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
