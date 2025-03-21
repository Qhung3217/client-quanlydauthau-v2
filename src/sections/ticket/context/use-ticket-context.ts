'use client';

import { useContext } from 'react';

import { TicketContext } from './ticket-context';

// ----------------------------------------------------------------------

export function useTicketContext() {
  const context = useContext(TicketContext);

  if (!context) {
    throw new Error('usTicketContext: Context must be used inside TicketProvider');
  }

  return context;
}
