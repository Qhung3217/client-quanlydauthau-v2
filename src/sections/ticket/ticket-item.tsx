import type { Creator } from 'src/types/user';
import type { Ticket } from 'src/types/ticket';
import type { LabelColor } from 'src/components/label';
import type { ListItemButtonProps } from '@mui/material/ListItemButton';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ListItemButton from '@mui/material/ListItemButton';
import { Avatar, AvatarGroup, ListItemText } from '@mui/material';

import { fToNow } from 'src/utils/format-time';
import { attachServerUrl } from 'src/utils/attach-server-url';

import { getTicketStatusConfig } from 'src/helpers/get-ticket-status-config';

import { Label } from 'src/components/label';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

type Props = ListItemButtonProps & {
  ticket: Ticket;
  selected: boolean;
};

export function TicketItem({ ticket, selected, sx, ...other }: Props) {
  const { user } = useAuthContext();

  let senders: Creator[] = ticket.assignees.filter((assignee) => assignee.id !== user?.id);

  if (!senders.length) senders = ticket.assignees;

  return (
    <Box
      component="li"
      sx={{ display: 'flex', borderBottom: (theme) => `solid 1px ${theme.palette.divider}` }}
    >
      <ListItemButton
        disableGutters
        sx={[
          () => ({
            p: 1,
            gap: 2,
            borderRadius: 1,
            ...(selected && { bgcolor: 'action.selected' }),
          }),
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        {...other}
      >
        {senders.length > 1 ? (
          <AvatarGroup max={4}>
            {senders.map((sender) => (
              <Avatar key={sender.id} alt={sender.name} src={attachServerUrl(sender.avatar) || ''}>
                {sender.name.charAt(0).toUpperCase()}
              </Avatar>
            ))}
          </AvatarGroup>
        ) : (
          <Avatar alt={senders[0].name} src={attachServerUrl(senders[0].avatar) || ''}>
            {senders[0].name.charAt(0).toUpperCase()}
          </Avatar>
        )}
        <ListItemText
          primary={ticket.code + ' - ' + ticket.title}
          primaryTypographyProps={{ noWrap: true, component: 'span', variant: 'subtitle2' }}
          secondary={ticket.lastComment}
          secondaryTypographyProps={{
            noWrap: true,
            component: 'span',
          }}
        />

        <Box
          sx={{
            display: 'flex',
            alignSelf: 'stretch',
            alignItems: 'flex-end',
            flexDirection: 'column',
          }}
        >
          <Typography
            noWrap
            variant="body2"
            component="span"
            sx={{ mb: 1.5, fontSize: 12, color: 'text.disabled' }}
          >
            {fToNow(ticket.createdAt)}
          </Typography>
          <Typography
            noWrap
            variant="body2"
            component="span"
            sx={{ fontSize: 12, color: 'text.disabled' }}
          >
            <Label
              variant="soft"
              color={getTicketStatusConfig(ticket.status).color as LabelColor}
              sx={{ display: 'inline-flex', alignItems: 'center', py: 0.5 }}
            >
              {getTicketStatusConfig(ticket.status).label}
            </Label>
          </Typography>
        </Box>
      </ListItemButton>
    </Box>
  );
}
