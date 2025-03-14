import type { TypographyProps } from '@mui/material';

import { Typography } from '@mui/material';

import { maxLine } from 'src/theme/core/mixins/text';

type Props = TypographyProps & {
  line?: number;
};
export default function TextMaxLine({ children, sx, line, ...others }: Props) {
  return (
    <Typography
      {...others}
      sx={[
        () => ({
          ...maxLine({
            line: line ?? 2,
          }),
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {children}
    </Typography>
  );
}
