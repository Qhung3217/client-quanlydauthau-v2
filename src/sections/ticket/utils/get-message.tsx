// ----------------------------------------------------------------------

import type { Creator } from 'src/types/user';

type Props = {
  currentUserId: string;
  creator: Creator;
};

export function getMessage({ creator, currentUserId }: Props) {
  const isCurrentUser = creator.id === currentUserId;

  const senderDetails = isCurrentUser
    ? { type: 'me' }
    : { avatar: creator?.avatar, firstName: creator?.name?.split(' ')[0] ?? creator?.name };

  return { me: isCurrentUser, senderDetails };
}
