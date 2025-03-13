'use client';

import type { SelectChangeEvent } from '@mui/material';

import { uniqBy } from 'es-toolkit';
import { varAlpha } from 'minimal-shared/utils';
import { useBoolean } from 'minimal-shared/hooks';
import { useRef, useState, useEffect, useCallback } from 'react';

import { Select, Checkbox, MenuItem, InputLabel, FormControl, OutlinedInput } from '@mui/material';

type OptionItem = { value: string; label: string };
type Props = {
  filters: OptionItem[];
  onFilter: (value: OptionItem[]) => void;
  label: string;
  options: OptionItem[];
  loading: boolean;
  hasMore: boolean;
  onFetchNext: () => void;
};
export default function TableFilter({
  filters,
  onFilter,
  label,
  options,
  loading,
  hasMore,
  onFetchNext,
}: Props) {
  const [localValue, setLocalValue] = useState(() => filters?.map((filter) => filter.value) || []);
  const [optionsRender, setOptionsRender] = useState<OptionItem[]>([]);
  const observer = useRef<IntersectionObserver>();
  const isOpen = useBoolean();

  useEffect(() => {
    let active = true;
    if (active) {
      setOptionsRender((prev) => [...prev, ...uniqBy(options, (item) => item.value)]);
    }
    return () => {
      active = false;
    };
  }, [options]);

  const lastElementRef = useCallback(
    (node: any) => {
      if (loading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore && isOpen.value) {
            onFetchNext();
          }
        },
        {
          //  root: document.querySelector('.MuiList-root[role="listbox"]'),
          threshold: 1,
        }
      );

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, isOpen.value, onFetchNext]
  );
  const handleChangeLocalValue = useCallback((event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    setLocalValue(typeof value === 'string' ? value.split(',') : value);
  }, []);

  const handleFilter = useCallback(() => {
    onFilter(optionsRender.filter((option) => localValue.includes(option.value)));
    isOpen.onFalse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onFilter, localValue, optionsRender]);

  return (
    <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 200 } }} size="small">
      <InputLabel
      //  htmlFor={`filter-${label}`}
      >
        {label}
      </InputLabel>

      <Select
        multiple
        MenuProps={{}}
        value={localValue}
        onOpen={isOpen.onTrue}
        onChange={handleChangeLocalValue}
        onClose={handleFilter}
        input={<OutlinedInput label={label} />}
        renderValue={(selected: any) => {
          const optionsSelected = optionsRender.filter((option) => selected.includes(option.value));

          return optionsSelected.map((option) => option.label).join(', ');
        }}
        // inputProps={{ id: 'filter-stock-select' }}
        sx={{ textTransform: 'capitalize' }}
      >
        {optionsRender.map((option, index) => {
          if (index === optionsRender.length - 1) {
            return (
              <MenuItem key={option.value} value={option.value} ref={lastElementRef}>
                <Checkbox
                  disableRipple
                  size="small"
                  checked={localValue.some((local) => local === option.value)}
                />
                {option.label}
              </MenuItem>
            );
          }
          return (
            <MenuItem key={option.value} value={option.value}>
              <Checkbox
                disableRipple
                size="small"
                checked={localValue.some((local) => local === option.value)}
              />
              {option.label}
            </MenuItem>
          );
        })}
        {loading && <MenuItem disabled>Đang tải..</MenuItem>}
        <MenuItem
          onClick={handleFilter}
          sx={[
            (theme) => ({
              justifyContent: 'center',
              fontWeight: theme.typography.button,
              bgcolor: varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
              border: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
            }),
          ]}
        >
          Áp dụng
        </MenuItem>
      </Select>
    </FormControl>
  );
}
