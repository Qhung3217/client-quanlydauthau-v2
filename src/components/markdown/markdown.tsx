import type { SxProps } from '@mui/material';

import { Box } from '@mui/material';

import { Scrollbar } from '../scrollbar';

type Props = {
  value: any;
  slotProps?: {
    container?: SxProps;
  };
};
export default function Markdown({ value, slotProps }: Props) {
  return (
    <Scrollbar
      sx={[
        () => ({ p: 0.5 }),
        ...(Array.isArray(slotProps?.container) ? slotProps.container : [slotProps?.container]),
      ]}
    >
      <Box
        sx={{
          '& *': {
            p: 0,
            m: 0,
          },
          width: 1,
        }}
        dangerouslySetInnerHTML={{
          __html: value || 'Chưa có mô tả',
        }}
      />
    </Scrollbar>
  );
}
