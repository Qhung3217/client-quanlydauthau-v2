'use client';

import type { Priority } from 'src/types/priority';

import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';

import { Box } from '@mui/material';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import CardHeader from '@mui/material/CardHeader';
import LoadingButton from '@mui/lab/LoadingButton';

import { useRouter } from 'src/routes/hooks';

import { PRIORITY_COLOR_OBJ } from 'src/constants/priority';
import { createPriority, updatePriority } from 'src/actions/priority-ssr';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';
import BlockField from 'src/components/hook-form/block-field';

import PriorityColorField from './priority-color-field';

// ----------------------------------------------------------------------

export type PrioritySchemaType = zod.infer<typeof PrioritySchema>;

export const PrioritySchema = zod.object({
  name: zod.string().min(1, 'Tên độ ưu tiên là bắt buộc!'),
  color: zod.string().min(1, 'Màu sắc là bắt buộc!'),
});

// ----------------------------------------------------------------------

type Props = {
  currentRecord?: Priority;
  loading?: boolean;
  btnRef?: React.RefObject<HTMLButtonElement>;
  onSubmit?: () => void;
};

const PriorityCreateEditForm = ({
  currentRecord,
  loading,
  btnRef,
  onSubmit: emitSubmit,
}: Props) => {
  const router = useRouter();

  const checkingCode = useBoolean();

  const isEdit = !!currentRecord;

  const recordFormData = useMemo(() => {
    if (!isEdit) return undefined;
    return currentRecord;
  }, [currentRecord, isEdit]);

  const defaultValues: PrioritySchemaType = {
    name: '',
    color: PRIORITY_COLOR_OBJ['#71717a'].color,
  };

  const methods = useForm<PrioritySchemaType>({
    resolver: zodResolver(PrioritySchema),
    defaultValues,
    values: recordFormData,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (!isEdit) {
        await createPriority(data);

        toast.success('Thêm thành công !');
      } else {
        await updatePriority(currentRecord.id, data);

        toast.success('Cập nhật thành công !');
      }
      reset();
      emitSubmit?.();
    } catch (error: any) {
      console.error(error);
      toast.error('Đã có lỗi xảy ra.');
    }
  });

  const renderDetails = () => (
    <Card>
      <CardHeader title="Thiết lập độ ưu tiên" />

      <Stack spacing={3} sx={{ p: 3 }}>
        <BlockField label="Độ ưu tiên" required>
          <Field.Text name="name" size="small" disabled={loading} />
        </BlockField>
        <PriorityColorField />
      </Stack>
    </Card>
  );

  const renderActions = () => (
    <Box
      sx={{
        gap: 3,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
      }}
    >
      {btnRef !== undefined ? (
        <button ref={btnRef} type="submit" style={{ display: 'none' }}>
          submit
        </button>
      ) : (
        <LoadingButton
          type="submit"
          variant="contained"
          size="large"
          loading={isSubmitting || !!loading}
          disabled={!!loading || checkingCode.value}
          sx={{ ml: 'auto' }}
        >
          {!isEdit ? 'Thêm độ ưu tiên' : 'Lưu thay đổi'}
        </LoadingButton>
      )}
    </Box>
  );
  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 880 } }}>
        {renderDetails()}

        {renderActions()}
      </Stack>
    </Form>
  );
};

export default PriorityCreateEditForm;
