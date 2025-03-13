import type { UserStatus } from 'src/types/user';

export const USER_STATUS_OBJ: { [k in UserStatus]: UserStatus } = {
  ACTIVE: 'ACTIVE',
  BLOCKED: 'BLOCKED',
};
