import type { Creator, UserBasic } from './user';

export type Ticket = {
  id: string;
  type: string;
  code: string;
  status: string;
  title: string;
  createdAt: Date;
  lastCommentAt: Date;
  lastComment: string;
  creator: Creator;
  assignees: UserBasic[];
};
