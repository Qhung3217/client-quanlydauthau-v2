export const getTicketStatusConfig = (value: string) => {
  switch (value) {
    case 'OPEN':
      return {
        color: 'info',
        label: 'Chờ xử lý',
      };
    case 'IN_PROGRESS':
      return {
        color: 'warning',
        label: 'Đang xử lý',
      };
    case 'RESOLVED':
      return {
        color: 'info',
        label: 'Đã xử lý',
      };
    case 'CLOSED':
      return {
        color: 'error',
        label: 'Đóng',
      };

    default:
      return {
        color: 'default',
        label: 'Chưa xác định',
      };
  }
};
