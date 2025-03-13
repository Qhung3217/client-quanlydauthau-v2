import { CONFIG } from 'src/global-config';

export const attachServerUrl = (value: string | undefined) => `${CONFIG.serverUrl}/${value}`;
