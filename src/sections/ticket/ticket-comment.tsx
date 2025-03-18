import type { TicketComment } from 'src/types/ticket';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

import { fToNow } from 'src/utils/format-time';
import { attachServerUrl } from 'src/utils/attach-server-url';

import { useAuthContext } from 'src/auth/hooks';

import { getMessage } from './utils/get-message';

// ----------------------------------------------------------------------

type Props = {
  comment: TicketComment;
};

export function TicketComment({ comment }: Props) {
  const { user } = useAuthContext();

  const { me, senderDetails } = getMessage({
    creator: comment.creator,
    currentUserId: `${user?.id}`,
  });

  const { firstName, avatar } = senderDetails;

  const { content, createdAt } = comment;

  const renderInfo = () => (
    <Typography
      noWrap
      variant="caption"
      sx={{ mb: 1, color: 'text.disabled', ...(!me && { mr: 'auto' }) }}
    >
      {!me && `${firstName}, `}

      {fToNow(createdAt)}
    </Typography>
  );

  const renderBody = () => (
    <Stack
      sx={{
        p: 1,
        minWidth: 48,
        maxWidth: 320,
        borderRadius: 0.5,
        typography: 'body2',
        bgcolor: 'background.neutral',
        ...(me && { color: 'grey.800', bgcolor: 'primary.lighter' }),
      }}
    >
      {content}
    </Stack>
  );

  if (!comment.content) {
    return null;
  }

  return (
    <Box sx={{ mb: 3, display: 'flex', justifyContent: me ? 'flex-end' : 'unset' }}>
      {!me && (
        <Avatar
          alt={firstName}
          src={attachServerUrl(avatar)}
          sx={{ width: 32, height: 32, mx: 2 }}
        />
      )}

      <Stack alignItems={me ? 'flex-end' : 'flex-start'} sx={{ mr: 2 }}>
        {renderInfo()}

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            '&:hover': { '& .message-actions': { opacity: 1 } },
          }}
        >
          {renderBody()}
        </Box>
      </Stack>
    </Box>
  );
}
