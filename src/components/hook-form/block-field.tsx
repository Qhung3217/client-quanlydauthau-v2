import type { StackProps } from '@mui/material';

import { Box, Stack, Typography } from '@mui/material';

type Props = Omit<StackProps, 'children' | 'label' | 'required'> & {
  children: React.ReactNode;
  label: string;
  required?: boolean;
};

export default function BlockField({ children, label, required, sx, ...props }: Props) {
  return (
    <Stack
      spacing={1}
      sx={{
        width: 1,
        ...sx,
      }}
      {...props}
    >
      <Typography variant="subtitle2">
        {label}
        {required && (
          <Box component="strong" sx={{ color: 'error.main', fontSize: '1rem', lineHeight: '1' }}>
            {' '}
            *
          </Box>
        )}
      </Typography>
      {children}
    </Stack>
  );
}
