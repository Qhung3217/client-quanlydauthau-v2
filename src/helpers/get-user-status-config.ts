export const getUserStatusConfig = (value: string) => {
  switch (value) {
    case 'ACTIVE':
      return {
        color: 'info',
        label: 'Kích hoạt',
      };
    case 'BLOCKED':
      return {
        color: 'warning',
        label: 'Đã chặn',
      };

    default:
      return {
        color: 'default',
        label: 'Chưa xác định',
      };
  }
};
