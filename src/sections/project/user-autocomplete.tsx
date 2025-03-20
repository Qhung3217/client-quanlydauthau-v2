'use client';

import type { User } from 'src/types/user';
import type { RHFAutocompleteProps } from 'src/components/hook-form';

import { useFormContext } from 'react-hook-form';

import { Box, Avatar, Typography } from '@mui/material';

import { attachServerUrl } from 'src/utils/attach-server-url';

import { useGetUsers } from 'src/actions/user';

import { Field } from 'src/components/hook-form';

type Props = Omit<RHFAutocompleteProps, 'options'> & {
  name: string;
};
export default function UserAutocomplete({ name, ...others }: Props) {
  const { watch } = useFormContext();

  const { users, usersLoading } = useGetUsers({
    perPage: Number.MAX_SAFE_INTEGER,
  });

  const selectedValue = watch(name);

  return (
    <Field.Autocomplete
      name={name}
      size="small"
      getOptionLabel={(option) => option.name}
      options={users}
      filterOptions={(opts) => {
        const selectedIds = new Set(selectedValue.map((s: any) => s.id));
        return opts.filter((opt) => !selectedIds.has(opt.id));
      }}
      loading={usersLoading}
      disableCloseOnSelect={others.multiple}
      renderOption={(props, option: User) => (
        <Box component="li" sx={{ display: 'flex', alignItems: 'center', p: 1 }} {...props}>
          <Avatar
            src={attachServerUrl(option.avatar)}
            alt={option.name}
            sx={{ width: 40, height: 40, mr: 1 }}
          />
          <Box>
            <Typography variant="body1">{option.name}</Typography>
          </Box>
        </Box>
      )}
      {...others}
    />
  );
}
