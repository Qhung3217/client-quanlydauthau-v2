import { Box, Stack } from '@mui/material';

import { fDate, fTime } from 'src/utils/format-time';

type Props = {
  value: string;
};
export function RenderCellCreatedAt({ value }: Props) {
  return (
    <Stack spacing={0.5}>
      <Box component="span">{fDate(value)}</Box>

      <Box
        component="span"
        sx={{ typography: 'caption', color: 'text.secondary', textAlign: 'center' }}
      >
        {fTime(value)}
      </Box>
    </Stack>
  );
}
