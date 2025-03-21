'use client';

import { useMemo } from 'react';
import { useSetState } from 'minimal-shared/hooks';

import { TicketContext } from './ticket-context';

import type { TicketState } from './ticket-context-type';

// ----------------------------------------------------------------------

/**
 * NOTE:
 * We only build demo at basic level.
 * Customer will need to do some extra handling yourself if you want to extend the logic and other features...
 */

type Props = {
  children: React.ReactNode;
};

export function TicketProvider({ children }: Props) {
  const { state, setState, setField, resetState } = useSetState<TicketState>({
    project: null,
    assignee: '',
    openCompose: false,
  });

  // ----------------------------------------------------------------------

  const memoizedValue = useMemo(
    () => ({
      project: state?.project || null,
      assignee: state.assignee,
      openCompose: state.openCompose,
      setField,
      resetState,
      setState,
    }),
    [state, setField, resetState, setState]
  );

  return <TicketContext.Provider value={memoizedValue}>{children}</TicketContext.Provider>;
}
