'use client';

import type { Project } from 'src/types/project';

import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import { Box, MenuItem } from '@mui/material';
import CardHeader from '@mui/material/CardHeader';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useGetPriorities } from 'src/actions/priority';
import { createProject, updateProject } from 'src/actions/project-ssr';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';
import BlockField from 'src/components/hook-form/block-field';

import UserAutocomplete from './user-autocomplete';
import PriorityTag from '../priority/priority-tag';
import CompanyAutocomplete from './company-autocomplete';

// ----------------------------------------------------------------------

export type ProjectSchemaType = zod.infer<typeof ProjectSchema>;

export const ProjectSchema = zod.object({
  name: zod
    .string({
      required_error: 'Tên dự án là bắt buộc',
    })
    .min(1, 'Tên dự án không được để trống'),
  address: zod
    .string({
      required_error: 'Địa chỉ là bắt buộc',
    })
    .min(1, 'Địa chỉ không được để trống'),
  investorId: zod.any().refine((value) => !!value, { message: 'Bên mời thầu không được để trống' }),
  inviterId: zod.any().refine((value) => !!value, { message: 'Bên mời thầu không được để trống' }),
  priorityId: zod.string(),
  estDeadline: zod
    .string({
      required_error: 'Hạn đóng dự toán dự kiến là bắt buộc',
    })
    .refine((date) => new Date(date) > new Date(), {
      message: 'Hạn đóng dự toán phải là ngày trong tương lai',
    }),
  estimatorIds: zod.array(zod.any()).min(1, 'Phải có ít nhất một người dự toán'),
});

// ----------------------------------------------------------------------

type Props = {
  currentRecord?: Project;
  loading?: boolean;
};

export function ProjectNewEditForm({ currentRecord, loading }: Props) {
  const router = useRouter();

  const checkingCode = useBoolean();

  const isEdit = !!currentRecord;

  const { priorities, prioritiesLoading } = useGetPriorities({
    perPage: Number.MAX_SAFE_INTEGER,
  });

  const recordFormData = useMemo(() => {
    if (!isEdit) return undefined;
    return {
      ...currentRecord,
      investorId: currentRecord.investor,
      inviterId: currentRecord.inviter,
      priorityId: currentRecord?.priority?.id || '',
      estimatorIds: currentRecord.estimators,
    };
  }, [currentRecord, isEdit]);

  const defaultValues: ProjectSchemaType = {
    name: '',
    address: '',
    investorId: null,
    inviterId: null,
    priorityId: '',
    estDeadline: '',
    estimatorIds: [],
  };

  const methods = useForm<ProjectSchemaType>({
    resolver: zodResolver(ProjectSchema),
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
        await createProject({
          ...data,
          estimatorIds: data.estimatorIds.map((row) => row.id),
          investorId: data.investorId.id,
          inviterId: data.inviterId.id,
        });

        toast.success('Đã thêm dự án thành công !');
      } else {
        await updateProject(currentRecord.id, {
          ...data,
          estimatorIds: data.estimatorIds.map((row) => row.id),
          investorId: data.investorId.id,
          inviterId: data.inviterId.id,
        });

        toast.success('Đã cập nhật dự án thành công !');
        router.push(paths.project.details(currentRecord.id));
      }
      reset();
    } catch (error: any) {
      console.error(error);
      if (error.statusCode === 409) {
        toast.error(error.message || 'Đã có lỗi xảy ra.');
      } else {
        toast.error('Đã có lỗi xảy ra.');
      }
    }
  });

  const renderInfo = () => (
    <Card>
      <CardHeader title="Thông tin dự án" />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <BlockField label="Tên dự án" required>
          <Field.Text name="name" size="small" disabled={loading} />
        </BlockField>

        <BlockField label="Địa chỉ" required>
          <Field.Text name="address" size="small" />
        </BlockField>
      </Stack>
    </Card>
  );
  const renderRelative = () => (
    <Card>
      <CardHeader title="Bên liên quan" />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <BlockField label="Chủ đầu tư" required>
          <CompanyAutocomplete name="investorId" disabled={loading} />
        </BlockField>

        <BlockField label="Bên mời thầu" required>
          <CompanyAutocomplete name="inviterId" disabled={loading} />
        </BlockField>
      </Stack>
    </Card>
  );

  const renderPriority = () => (
    <Card>
      <CardHeader title="Ưu tiên và phân công" />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <BlockField label="Người làm dự toán" required>
          <UserAutocomplete
            name="estimatorIds"
            disabled={!!loading}
            multiple
            filterSelectedOptions
          />
        </BlockField>

        <BlockField label="Hạn đóng dự toán" required>
          <Field.DatePicker
            desktopModeMediaQuery="lg"
            reduceAnimations
            disablePast
            name="estDeadline"
            slotProps={{
              textField: {
                size: 'small',
              },
            }}
          />
        </BlockField>

        <BlockField label="Mức độ ưu tiên">
          <Field.Select
            name="priorityId"
            size="small"
            disabled={loading || prioritiesLoading}
            sx={{ background: 'white' }}
          >
            {priorities.map((option) => (
              <MenuItem
                key={option.id}
                value={option.id}
                sx={{
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <PriorityTag priority={option} />
                {option.name}
              </MenuItem>
            ))}
          </Field.Select>
        </BlockField>
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
      <LoadingButton
        type="submit"
        variant="contained"
        size="large"
        loading={isSubmitting || loading}
        disabled={loading || checkingCode.value}
        sx={{ ml: 'auto' }}
      >
        {!isEdit ? 'Thêm dự án' : 'Lưu thay đổi'}
      </LoadingButton>
    </Box>
  );
  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto' }}>
        {renderInfo()}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(1,1fr)',
              md: 'repeat(2,1fr)',
            },
            gap: { xs: 3, md: 5 },
          }}
        >
          {renderRelative()}
          {renderPriority()}
        </Box>
        {renderActions()}
      </Stack>
    </Form>
  );
}
