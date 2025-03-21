import type { TicketType, TicketStatus } from 'src/types/ticket';

export const TICKET_STATUS_OBJ: { [k in TicketStatus]: k } = {
  CLOSED: 'CLOSED',
  IN_PROGRESS: 'IN_PROGRESS',
  OPEN: 'OPEN',
  RESOLVED: 'RESOLVED',
};

export const TICKET_TYPE_OBJ: { [k in TicketType]: k } = {
  OTHER: 'OTHER',
  PROJECT: 'PROJECT',
};
