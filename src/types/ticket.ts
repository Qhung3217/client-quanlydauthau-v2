import type { Creator } from './user';

export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';

export type TicketComment = {
  id: string;
  content: string;
  createdAt: Date;
  ticketId: string;
  creator: Creator;
};

export type Ticket = {
  id: string;
  type: string;
  code: string;
  status: TicketStatus;
  title: string;
  createdAt: Date;
  lastCommentAt: Date;
  lastComment: string;
  creator: Creator;
  assignees: Creator[];
};
