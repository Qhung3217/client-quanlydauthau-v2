import { z as zod } from 'zod';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Portal from '@mui/material/Portal';
import Backdrop from '@mui/material/Backdrop';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import useMediaQuery from '@mui/material/useMediaQuery';

import { createTicket } from 'src/actions/ticket-ssr';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';
import BlockField from 'src/components/hook-form/block-field';

// ----------------------------------------------------------------------

const POSITION = 20;

type Props = {
  onCloseCompose: () => void;
};

export type NewTicketSchemaType = zod.infer<typeof NewTicketSchema>;

export const NewTicketSchema = zod.object({
  content: zod.string().min(1, 'Nội dung là bắt buộc!'),
  title: zod.string().min(1, 'Tiêu đề là bắt buộc!'),
  assignee: zod.string().min(1, 'Người nhận là bắt buộc!'),
  type: zod.string().min(1, 'Loại là bắt buộc!'),
});

export function TicketCompose({ onCloseCompose }: Props) {
  const theme = useTheme();
  const smUp = useMediaQuery(theme.breakpoints.up('sm'));

  const fullScreen = useBoolean();

  const defaultValues: NewTicketSchemaType = {
    title: '',
    content: '',
    assignee: '',
    type: 'PROJECT',
  };

  const methods = useForm<NewTicketSchemaType>({
    resolver: zodResolver(NewTicketSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data: any) => {
    try {
      await createTicket(data);

      toast.success('Gửi ticket thành công');

      onCloseCompose();

      reset();
    } catch (error: any) {
      toast.error(error.message);
    }
  });

  useEffect(() => {
    if (fullScreen.value) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [fullScreen.value]);

  return (
    <Portal>
      {(fullScreen.value || !smUp) && <Backdrop open sx={[{ zIndex: theme.zIndex.modal - 1 }]} />}

      <Paper
        sx={[
          {
            maxWidth: 560,
            right: POSITION,
            borderRadius: 2,
            display: 'flex',
            bottom: POSITION,
            position: 'fixed',
            overflow: 'hidden',
            flexDirection: 'column',
            zIndex: theme.zIndex.modal,
            width: `calc(100% - ${POSITION * 2}px)`,
            boxShadow: theme.vars.customShadows.dropdown,
            ...(fullScreen.value && { maxWidth: 1, height: `calc(100% - ${POSITION * 2}px)` }),
          },
        ]}
      >
        <Form methods={methods} onSubmit={onSubmit}>
          <Box
            sx={[
              {
                display: 'flex',
                alignItems: 'center',
                bgcolor: 'background.neutral',
                p: theme.spacing(1.5, 1, 1.5, 2),
              },
            ]}
          >
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Tạo mới ticket
            </Typography>

            <IconButton onClick={fullScreen.onToggle}>
              <Iconify icon={fullScreen.value ? 'eva:collapse-fill' : 'eva:expand-fill'} />
            </IconButton>

            <IconButton onClick={onCloseCompose}>
              <Iconify icon="mingcute:close-line" />
            </IconButton>
          </Box>

          <Stack spacing={2} flexGrow={1} sx={{ p: 2, flex: '1 1 auto', overflow: 'hidden' }}>
            <BlockField label="Email hoặc số điện thoại người nhận" required>
              <Field.Text name="assignee" size="small" placeholder="abc@gmail.com" />
            </BlockField>

            <BlockField label="Tiêu đề" required>
              <Field.Text name="title" size="small" placeholder="Tôi cần hỗ trợ..." />
            </BlockField>

            <BlockField label="Nội dung" required>
              <Field.Text
                rows={5}
                multiline
                name="content"
                size="small"
                placeholder="Nhập nội dung..."
              />
            </BlockField>
          </Stack>

          <Stack spacing={2} flexGrow={1} sx={{ p: 2, flex: '1 1 auto', overflow: 'hidden' }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <LoadingButton
                loading={isSubmitting}
                variant="contained"
                color="primary"
                endIcon={<Iconify icon="iconamoon:send-fill" />}
                type="submit"
              >
                Gửi
              </LoadingButton>
            </Box>
          </Stack>
        </Form>
      </Paper>
    </Portal>
  );
}
