import type { Creator } from './user';
import type { Project } from './project';

export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';

export type TicketType = 'PROJECT' | 'OTHER';

export type TicketComment = {
  id: string;
  content: string;
  createdAt: Date;
  ticketId: string;
  creator: Creator;
};

export type Ticket = {
  id: string;
  type: TicketType;
  code: string;
  status: TicketStatus;
  title: string;
  createdAt: Date;
  lastCommentAt: Date;
  lastComment: string;
  creator: Creator;
  project: Omit<Project, '_count'>;
  assignees: Creator[];
};
