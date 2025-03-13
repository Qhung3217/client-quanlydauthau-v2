import type { Company } from 'src/types/company';
import type { GridColDef, GridCellParams } from '@mui/x-data-grid';

import { GridActionsCellItem } from '@mui/x-data-grid';
import { Box, Avatar, ListItemText } from '@mui/material';

import { paths } from 'src/routes/paths';

import { attachServerUrl } from 'src/utils/attach-server-url';

import { Iconify } from 'src/components/iconify';
import { GridActionsLinkItem } from 'src/components/data-table';

type Props = {
  onDelete: (id: string) => void;
  onViewClick: (row: any) => void;
  permit: {
    delete: boolean;
    update: boolean;
  };
};
export const getColumns = ({ onDelete, onViewClick, permit }: Props): GridColDef[] => [
  {
    field: 'tax',
    headerName: 'MST',
    width: 120,
    headerAlign: 'center',
    align: 'center',
    hideable: false,
  },
  {
    field: 'name',
    headerName: 'Đơn vị',
    flex: 1,
    minWidth: 360,
    hideable: false,
    renderCell: (params) => <RenderCellInfo params={params} />,
  },
  {
    field: 'phone',
    headerName: 'SĐT',
    width: 120,
    headerAlign: 'center',
    align: 'center',
  },
  {
    field: 'representativeName',
    headerName: 'Đại diện',
    filterable: false,
    headerAlign: 'center',
    minWidth: 150,
    renderCell: (params) => <RenderCellRepresentative params={params} />,
  },
  {
    field: 'email',
    headerName: 'Email',
    minWidth: 150,
  },

  {
    type: 'actions',
    field: 'actions',
    headerName: ' ',
    align: 'right',
    headerAlign: 'right',
    width: 80,
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
    getActions: (params) => {
      const actions = [
        <GridActionsCellItem
          icon={<Iconify icon="ph:eye-fill" />}
          label="Xem"
          onClick={() => {
            onViewClick(params.row);
          }}
        />,
      ];
      if (permit.update)
        actions.push(
          <GridActionsLinkItem
            showInMenu
            icon={<Iconify icon="solar:pen-bold" />}
            label="Chỉnh sửa"
            href={paths.organization.edit(params.row.id)}
          />
        );
      if (permit.delete)
        actions.push(
          <GridActionsCellItem
            showInMenu
            icon={<Iconify icon="solar:trash-bin-trash-bold" />}
            label="Xóa"
            onClick={() => onDelete(params.row.id)}
            sx={{ color: 'error.main' }}
          />
        );
      return actions;
    },
  },
];

// ----------------------------------------------------------------------

type ParamsProps = {
  params: GridCellParams<Company>;
};
export function RenderCellInfo({ params }: ParamsProps) {
  return (
    <Box
      sx={{
        py: 2,
        width: 1,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Avatar
        alt={params.row.name}
        src={attachServerUrl(params.row.logo)}
        variant="rounded"
        sx={{ width: 64, height: 64, mr: 2 }}
      />
      <ListItemText
        primaryTypographyProps={{
          variant: 'subtitle2',
          title: params.row.name,
          sx: {
            ...({ '-webkit-line-clamp': 2 } as any),
            '-webkit-box-orient': 'vertical',
            overflow: 'hidden',
            display: '-webkit-box',
            textOverflow: 'ellipsis',
          },
        }}
        primary={params.row.name}
        secondary={`${params.row.address}`}
        sx={{ display: 'flex', flexDirection: 'column' }}
      />
    </Box>
  );
}

export function RenderCellRepresentative({ params }: ParamsProps) {
  return (
    <Box
      sx={{
        py: 2,
        width: 1,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <ListItemText
        primaryTypographyProps={{
          variant: 'subtitle2',
          title: params.row.representativeName,
          sx: {
            ...({ '-webkit-line-clamp': 1 } as any),
            '-webkit-box-orient': 'vertical',
            overflow: 'hidden',
            display: '-webkit-box',
            textOverflow: 'ellipsis',
          },
        }}
        primary={params.row.representativeName}
        secondary={`${params.row.representativePosition}`}
        secondaryTypographyProps={{
          textAlign: 'center',
        }}
        sx={{ display: 'flex', flexDirection: 'column' }}
      />
    </Box>
  );
}
