import type { Project } from 'src/types/project';
import type { UseSetStateReturn } from 'minimal-shared/hooks';

export type TicketContextValue = Omit<UseSetStateReturn<TicketState>, 'state'> & TicketState;

export type TicketState = {
  project: Project | null;
  assignee: string;

  openCompose: boolean;
};
