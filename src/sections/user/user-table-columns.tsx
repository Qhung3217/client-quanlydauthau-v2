import type { GridColDef, GridCellParams } from '@mui/x-data-grid';

import { GridActionsCellItem } from '@mui/x-data-grid';
import { Box, Avatar, ListItemText } from '@mui/material';

import { paths } from 'src/routes/paths';

import { attachServerUrl } from 'src/utils/attach-server-url';
import { getUserStatusConfig } from 'src/helpers/get-user-status-config';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { GridActionsLinkItem } from 'src/components/data-table';

type Props = {
  onDelete: (id: string) => void;
  onResetPassword: (id: string, username: string) => void;
  permit: {
    delete: boolean;
    update: boolean;
  };
};
export const getColumns = ({ onDelete, onResetPassword, permit }: Props): GridColDef[] => [
  {
    field: 'name',
    headerName: 'Người dùng',
    minWidth: 360,
    flex: 1,
    hideable: false,
    renderCell: (params) => <RenderCellUser params={params} />,
  },
  {
    field: 'username',
    headerName: 'Tên đăng nhập',
    hideable: false,
  },
  {
    field: 'role',
    headerName: 'Quyền hạn',
    hideable: false,
    renderCell: (params) => <>{params?.value?.name || <Label>Chưa cấp</Label>}</>,
  },
  {
    field: 'company',
    headerName: 'Công ty',
    minWidth: 200,
    headerAlign: 'center',
    renderCell: (params) => <RenderCellCompany params={params} />,
  },

  {
    field: 'status',
    headerName: 'Trạng thái',
    renderCell: (params) => <RenderCellStatus params={params} />,
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
      const actions = [];
      if (permit.update)
        actions.push(
          <GridActionsCellItem
            showInMenu
            icon={<Iconify icon="mdi:password" />}
            label="Đặt lại mật khẩu"
            onClick={() => onResetPassword(params.row.id, params.row.username)}
          />,
          <GridActionsLinkItem
            showInMenu
            icon={<Iconify icon="solar:pen-bold" />}
            label="Chỉnh sửa"
            href={paths.user.edit(params.row.id)}
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
  params: GridCellParams;
};

export function RenderCellUser({ params }: ParamsProps) {
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
        src={attachServerUrl(params.row.avatar)}
        variant="rounded"
        sx={{ width: 64, height: 64, mr: 2 }}
      />
      <ListItemText
        primaryTypographyProps={{
          variant: 'subtitle2',
          title: params.row.name,
          sx: {
            ...({ '-webkit-line-clamp': 1 } as any),
            '-webkit-box-orient': 'vertical',
            overflow: 'hidden',
            display: '-webkit-box',
            textOverflow: 'ellipsis',
          },
        }}
        primary={params.row.name}
        secondary={
          <>
            {params.row.phone}
            <br />
            {params.row.email}
          </>
        }
        sx={{ display: 'flex', flexDirection: 'column' }}
      />
    </Box>
  );
}
export function RenderCellCompany({ params }: ParamsProps) {
  const company = params.row.company;
  if (!company) return null;
  return (
    <Box
      sx={{
        py: 2,
        width: 1,
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <Avatar
        alt={company.name}
        src={attachServerUrl(company.logo)}
        variant="rounded"
        sx={{ width: 40, height: 40 }}
      />
      <ListItemText
        primaryTypographyProps={{
          variant: 'subtitle2',
          title: company.name,
          sx: {
            ...({ '-webkit-line-clamp': 2 } as any),
            '-webkit-box-orient': 'vertical',
            overflow: 'hidden',
            display: '-webkit-box',
            textOverflow: 'ellipsis',
          },
        }}
        primary={company.name}
        secondary={company.phone}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      />
    </Box>
  );
}
export function RenderCellStatus({ params }: ParamsProps) {
  const { color, label } = getUserStatusConfig(params.row.status);
  return <Label color={color as any}>{label}</Label>;
}
