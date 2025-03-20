import type { StoreHelpers, CallBackProps } from 'react-joyride';

import { STATUS } from 'react-joyride';
import { useRef, useState } from 'react';

import type { UseWalktourProps, UseWalktourReturn } from './types';

// ----------------------------------------------------------------------

export function useWalktour({ steps, defaultRun }: UseWalktourProps): UseWalktourReturn {
  const helpers = useRef<StoreHelpers>();

  const [run, setRun] = useState(!!defaultRun);

  const jsonFirstVisit = localStorage.getItem('first-visit');

  const isFirstVisit = jsonFirstVisit ? JSON.parse(jsonFirstVisit) : true;

  if (!isFirstVisit && run !== isFirstVisit) {
    setRun(false);
  }

  const setHelpers = (storeHelpers: StoreHelpers) => {
    helpers.current = storeHelpers;
  };

  const onCallback = (data: CallBackProps) => {
    const { status } = data;

    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRun(false);
      localStorage.setItem('first-visit', 'false');
    }
  };

  return {
    run,
    steps,
    setRun,
    onCallback,
    setHelpers,
  };
}
