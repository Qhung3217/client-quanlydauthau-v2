import type { SxProps } from '@mui/material';
import type { Priority } from 'src/types/priority';

import { Box } from '@mui/material';

import getPriorityColorConfig from 'src/helpers/get-priority-color-config';

import { Label } from 'src/components/label';

type Props = {
  priority: Priority;
  showText?: boolean;
  slotProps?: {
    container?: SxProps;
    label?: SxProps;
  };
};
export default function PriorityTag({ priority, showText, slotProps }: Props) {
  const { color, bgColor } = getPriorityColorConfig(priority.color);
  if (showText)
    return (
      <Box
        sx={{
          ...slotProps?.container,
        }}
      >
        <Label
          sx={{
            color,
            backgroundColor: bgColor,
            typography: 'subtitle2',
            px: 2,
            py: 1,
            ...slotProps?.label,
          }}
        >
          {priority.name}
        </Label>
      </Box>
    );
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: 6,
        height: 1,
        backgroundColor: color,
        boxShadow: `0px 0px 4px 8px ${bgColor}`,
        ...slotProps?.container,
      }}
    />
  );
}
