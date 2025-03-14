'use client';

import type { SxProps } from '@mui/material';

import { useState, useEffect } from 'react';
import { useDebounce } from 'minimal-shared/hooks';

import { Box, OutlinedInput } from '@mui/material';

import { Iconify } from 'src/components/iconify';

export type TableQuickFilterProps = {
  value: string;
  onChange: (value: string) => void;
  onReset: () => void;
  slotProps?: {
    container?: SxProps;
  };
};
export default function TableQuickFilter({
  value,
  onChange,
  onReset,
  slotProps,
}: TableQuickFilterProps) {
  const [inputValue, setInputValue] = useState(() => value || '');
  const debounceValue = useDebounce(inputValue, 500);

  useEffect(() => {
    onChange(debounceValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounceValue]);

  return (
    <Box
      sx={[
        {
          maxWidth: {
            xs: 1,
            md: 300,
          },
          width: 1,
        },
        ...(Array.isArray(slotProps?.container) ? slotProps.container : [slotProps?.container]),
      ]}
    >
      <OutlinedInput
        fullWidth
        value={inputValue}
        onChange={(event) => {
          setInputValue(event.target.value);
        }}
        placeholder="Tìm kiếm..."
        startAdornment={<Iconify icon="prime:search" />}
        endAdornment={
          value && (
            <Iconify
              icon="lets-icons:close-ring-duotone-line"
              onClick={() => {
                setInputValue('');
                onReset();
              }}
              sx={{ cursor: 'pointer' }}
            />
          )
        }
        size="small"
      />
    </Box>
  );
}
