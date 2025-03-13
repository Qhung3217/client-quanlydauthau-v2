import type { BoxProps } from '@mui/material/Box';

import { Controller, useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import { Button, styled, Typography } from '@mui/material';

import { Iconify } from '../iconify';
import { HelperText } from './help-text';
import { Upload, UploadBox, UploadAvatar } from '../upload';

import type { UploadProps } from '../upload';

// ----------------------------------------------------------------------

export type RHFUploadProps = UploadProps & {
  name: string;
  slotProps?: {
    wrapper?: BoxProps;
  };
};

export function RHFUploadAvatar({ name, slotProps, ...other }: RHFUploadProps) {
  const { control, setValue } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const onDrop = (acceptedFiles: File[]) => {
          const value = acceptedFiles[0];

          setValue(name, value, { shouldValidate: true });
        };

        return (
          <Box {...slotProps?.wrapper}>
            <UploadAvatar value={field.value} error={!!error} onDrop={onDrop} {...other} />

            <HelperText errorMessage={error?.message} sx={{ textAlign: 'center' }} />
          </Box>
        );
      }}
    />
  );
}

// ----------------------------------------------------------------------

export function RHFUploadBox({ name, ...other }: RHFUploadProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <UploadBox value={field.value} error={!!error} {...other} />
      )}
    />
  );
}

// ----------------------------------------------------------------------

export function RHFUpload({ name, multiple, helperText, ...other }: RHFUploadProps) {
  const { control, setValue } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const uploadProps = {
          multiple,
          accept: { 'image/*': [] },
          error: !!error,
          helperText: error?.message ?? helperText,
        };

        const onDrop = (acceptedFiles: File[]) => {
          const value = multiple ? [...field.value, ...acceptedFiles] : acceptedFiles[0];

          setValue(name, value, { shouldValidate: true });
        };

        return <Upload {...uploadProps} value={field.value} onDrop={onDrop} {...other} />;
      }}
    />
  );
}

// ----------------------------------------------------------------------
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

type RHFUploadButtonProps = React.InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  slotProps?: {
    wrapper?: BoxProps;
  };
  showValue?: boolean;
};
export function RHFUploadButton({
  name,
  slotProps,
  multiple,
  accept,
  showValue = true,
  ...others
}: RHFUploadButtonProps) {
  const { control, setValue } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const onDrop = (acceptedFiles: File[]) => {
          if (multiple) setValue(name, acceptedFiles, { shouldValidate: true });
          else {
            const file = acceptedFiles[0];
            setValue(name, file, { shouldValidate: true });
          }
        };

        return (
          <Box {...slotProps?.wrapper}>
            <Button
              component="label"
              variant="contained"
              tabIndex={-1}
              startIcon={<Iconify icon="bxs:cloud-upload" color="white" />}
              sx={{ backgroundColor: error?.message ? 'error.main' : '#0066c4', color: 'white' }}
            >
              Tải file
              <VisuallyHiddenInput
                type="file"
                accept={accept}
                onChange={(event) => {
                  console.log(event.target.files);
                  onDrop(event.target.files as any);
                }}
                {...others}
              />
            </Button>
            {!!field.value && showValue && (
              <Typography variant="subtitle2">
                {field.value instanceof File ? field.value.name : field.value}
              </Typography>
            )}
            <HelperText errorMessage={error?.message} />
          </Box>
        );
      }}
    />
  );
}
