'use client';

import type { Company } from 'src/types/company';
import type { RHFAutocompleteProps } from 'src/components/hook-form';

import { useFormContext } from 'react-hook-form';

import { Box, Avatar, Checkbox, Typography } from '@mui/material';

import { attachServerUrl } from 'src/utils/attach-server-url';

import { useGetCompanies } from 'src/actions/company';

import { Field } from 'src/components/hook-form';

type Props = Omit<RHFAutocompleteProps, 'options'> & {
  name: string;
};
export default function CompanyAutocomplete({ name, ...others }: Props) {
  const { watch } = useFormContext();

  const { companies, companiesLoading } = useGetCompanies({
    perPage: Number.MAX_SAFE_INTEGER,
  });

  const selectedValue = watch(name);

  return (
    <Field.Autocomplete
      name={name}
      size="small"
      getOptionLabel={(option) => option.name}
      options={companies}
      loading={companiesLoading}
      disableCloseOnSelect={others.multiple}
      renderOption={(props, option: Company, { selected }) => (
        <Box component="li" sx={{ display: 'flex', alignItems: 'center', p: 1 }} {...props}>
          {others.multiple && (
            <Checkbox
              checked={selectedValue.some((value: any) => option.id === value.id)}
              sx={{ mr: 1 }}
            />
          )}
          <Avatar
            src={attachServerUrl(option.logo)}
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
