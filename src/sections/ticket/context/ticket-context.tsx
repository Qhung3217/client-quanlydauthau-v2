'use client';

import { createContext } from 'react';

import type { TicketContextValue } from './ticket-context-type';

// ----------------------------------------------------------------------

export const TicketContext = createContext<TicketContextValue | undefined>(undefined);
