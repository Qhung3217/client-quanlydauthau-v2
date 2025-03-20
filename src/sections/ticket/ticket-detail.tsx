import type { Creator } from 'src/types/user';
import type { Ticket } from 'src/types/ticket';

import { toast } from 'sonner';
import { useRef, useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Fade,
  Menu,
  Avatar,
  MenuItem,
  TextField,
  IconButton,
  ListSubheader,
  CircularProgress,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fDateTime } from 'src/utils/format-time';
import { attachServerUrl } from 'src/utils/attach-server-url';

import { CONFIG } from 'src/global-config';
import { useGetTicketComments } from 'src/actions/ticket';
import { PERMISSION_ENUM } from 'src/constants/permission';
import { updateTicket, createTicketComment } from 'src/actions/ticket-ssr';
import { getTicketStatusConfig } from 'src/helpers/get-ticket-status-config';

import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';

import { useAuthContext } from 'src/auth/hooks';
import useCheckPermission from 'src/auth/hooks/use-check-permission';

import { TicketComment } from './ticket-comment';

const getTransitions = (status: string): string[] => {
  switch (status) {
    case 'OPEN':
      return ['IN_PROGRESS', 'RESOLVED'];
    case 'IN_PROGRESS':
      return ['RESOLVED'];
    case 'RESOLVED':
    case 'CLOSED':
    default:
      return [];
  }
};

// ----------------------------------------------------------------------

type Props = {
  ticket: Ticket;
  error?: string;
  isEmpty?: boolean;
  loading?: boolean;
};

export function TicketDetails({ ticket, isEmpty, error, loading }: Props) {
  const { user } = useAuthContext();

  const { SEND_PERMIT, UPDATE_PERMIT } = useCheckPermission({
    SEND_PERMIT: PERMISSION_ENUM.SEND_TICKET,
    UPDATE_PERMIT: PERMISSION_ENUM.UPDATE_STATUS_TICKET,
  });
  const endRef = useRef<HTMLDivElement>(null);

  const [newComment, setNewComment] = useState('');
  const [isSending, setIsSending] = useState(false);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const [possibleTransitions, setPossibleTransitions] = useState(getTransitions(ticket.status));

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleTicketStatusUpdate = async (newStatus: string) => {
    try {
      updateTicket(ticket.id, { status: newStatus as any });
      setPossibleTransitions(getTransitions(newStatus));
      toast.success('Cập nhật thành công');
      // eslint-disable-next-line @typescript-eslint/no-shadow
    } catch (error: any) {
      console.error(error);
      toast.success(error.message);
    } finally {
      handleMenuClose();
    }
  };

  const { ticketComments, ticketCommentsLoading } = useGetTicketComments(ticket.id);

  if (error) {
    return (
      <EmptyContent
        title={error}
        imgUrl={`${CONFIG.assetsDir}/assets/icons/empty/ic-email-disabled.svg`}
      />
    );
  }

  const receivers: Creator[] = ticket.assignees.filter((assignee) => assignee.id !== user?.id);

  const renderSubject = () => (
    <>
      <Stack direction="row" alignItems="center">
        <Typography
          variant="subtitle2"
          sx={[
            (theme) => ({
              ...theme.mixins.maxLine({ line: 2 }),
              flex: '1 1 auto',
            }),
          ]}
        >
          Re: #{ticket?.code} - {ticket?.title}
        </Typography>
        <IconButton
          size="small"
          LinkComponent={RouterLink}
          href={paths.project.details(ticket.project.id)}
          title="Đi đến dự án này"
          sx={{ ml: 0.5 }}
        >
          <Iconify icon="lucide:external-link" sx={{ width: 14, height: 14 }} />
        </IconButton>
      </Stack>
      <Stack
        spacing={0.5}
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ ml: 'auto' }}
      >
        <Typography variant="caption" noWrap sx={{ color: 'text.disabled' }}>
          {fDateTime(ticket?.createdAt)}
        </Typography>
        {UPDATE_PERMIT && possibleTransitions.length > 0 && (
          <>
            <IconButton size="small" onClick={handleMenuOpen}>
              <Iconify icon="eva:more-horizontal-fill" />
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
              <ListSubheader
                sx={{
                  fontWeight: 'bold',
                  bgcolor: 'transparent',
                  borderBottom: '1px solid',
                  mb: 1,
                }}
              >
                Đánh dấu ticket
              </ListSubheader>
              {possibleTransitions.map((status) => {
                const config = getTicketStatusConfig(status);
                return (
                  <MenuItem
                    key={status}
                    onClick={() => handleTicketStatusUpdate(status)}
                    sx={{ py: 1, color: `${config.color}.main` }}
                  >
                    {config.label}
                  </MenuItem>
                );
              })}
            </Menu>
          </>
        )}
      </Stack>
    </>
  );

  // eslint-disable-next-line consistent-return
  const renderSender = () => {
    if (!SEND_PERMIT) return null;
    if (receivers.length === 1) {
      const receiver = receivers[0];
      return (
        <>
          <Avatar alt={receiver.name} src={attachServerUrl(receiver.avatar)} sx={{ mr: 2 }}>
            {receiver.name.charAt(0).toUpperCase()}
          </Avatar>
          <Stack spacing={0.5} sx={{ width: 0, flexGrow: 1 }}>
            <Box sx={{ gap: 0.5, display: 'flex' }}>
              <Typography component="span" variant="subtitle2" sx={{ flexShrink: 0 }}>
                {receiver.name}
              </Typography>
              <Typography component="span" noWrap variant="body2" sx={{ color: 'text.secondary' }}>
                {receiver.email && `<${receiver.email}>`}
              </Typography>
            </Box>
          </Stack>
        </>
      );
    }
  };

  const renderContent = () => (
    <Box style={{ display: 'flex', flexDirection: 'column' }}>
      {ticketComments.map((comment) => (
        <TicketComment
          key={comment.id}
          comment={{
            id: comment.id,
            ticketId: comment.ticketId,
            content: comment.content,
            createdAt: comment.createdAt,
            creator: comment.creator,
          }}
        />
      ))}
      {ticketCommentsLoading && (
        <Fade in timeout={500}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 1 }}>
            <CircularProgress />
          </Box>
        </Fade>
      )}
    </Box>
  );

  const renderEditor = () => (
    <Box sx={{ textAlign: 'center' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <TextField
          sx={{ flex: 1 }}
          multiline
          InputProps={{
            sx: {
              padding: 1,
            },
          }}
          onChange={(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            setNewComment(event.target.value);
          }}
          onKeyDown={(event: React.KeyboardEvent) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              handleSendComment();
            }
          }}
          value={newComment}
        />
        <LoadingButton
          color="primary"
          variant="contained"
          endIcon={<Iconify icon="iconamoon:send-fill" />}
          onClick={handleSendComment}
          disabled={isSending}
        >
          Gửi
        </LoadingButton>
      </Box>
      <Typography
        variant="caption"
        sx={{
          mt: 1,
          color: 'text.secondary',
          textAlign: 'center',
          display: { xs: 'none', sm: 'block' },
        }}
      >
        *Lưu ý: Ticket đã xử lý nếu không có phản hồi trong 2 ngày sẽ tự động đóng.
      </Typography>
    </Box>
  );

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    setPossibleTransitions(getTransitions(ticket.status));
  }, [ticket.id, ticket.status]);

  const handleSendComment = async () => {
    if (!newComment.trim()) return;

    try {
      const payload = { content: newComment };

      setIsSending(true);
      await createTicketComment(ticket.id, payload);

      setNewComment('');

      if (endRef.current) {
        endRef.current.scrollTo({
          top: endRef.current.scrollHeight,
          behavior: 'smooth',
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-shadow
    } catch (error: any) {
      toast.error(error.message);
      console.error('Xảy ra lỗi trong quá trình gửi.', error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <Box
        sx={[
          (theme) => ({
            p: 2,
            gap: 2,
            display: 'flex',
            borderTop: `1px dashed ${theme.vars.palette.divider}`,
            borderBottom: `1px dashed ${theme.vars.palette.divider}`,
            flexDirection: {
              xs: 'column',
              md: 'row',
            },
          }),
        ]}
      >
        {renderSubject()}
      </Box>
      <Box
        sx={{
          pt: 2,
          px: 2,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {renderSender()}
      </Box>

      <Box
        id="scrollableDiv"
        component="div"
        ref={endRef}
        sx={{ mt: 3, flex: '1 1 240px' }}
        style={{
          height: 300,
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column-reverse',
          scrollbarWidth: 'none',
        }}
      >
        {renderContent()}
      </Box>

      <Stack spacing={2} sx={{ flexShrink: 0, p: 2 }}>
        {ticket.status !== 'CLOSED' ? (
          renderEditor()
        ) : (
          <Typography variant="caption" color="text.secondary" textAlign="center">
            Ticket này đã đóng.
          </Typography>
        )}
      </Stack>
    </>
  );
}
