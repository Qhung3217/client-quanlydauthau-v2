import type { GridColDef, GridCellParams } from '@mui/x-data-grid';

import { Button } from '@mui/material';
import { GridActionsCellItem } from '@mui/x-data-grid';

import { paths } from 'src/routes/paths';

import { Iconify } from 'src/components/iconify';
import { GridActionsLinkItem } from 'src/components/data-table';

type Props = {
  onDelete: (id: string) => void;
  onPermissionClick: (event: any, selected: any) => void;
  permit: {
    delete: boolean;
    update: boolean;
  };
};
export const getColumns = ({ onDelete, onPermissionClick, permit }: Props): GridColDef[] => {
  if (permit.delete || permit.delete)
    return [
      {
        field: 'name',
        headerName: 'Nhóm quyền',
        flex: 1,
        minWidth: 360,
        hideable: false,
      },

      {
        field: 'permissions',
        headerName: 'Quyền hạn',
        filterable: false,
        width: 200,
        headerAlign: 'center',
        align: 'center',
        renderCell: (params) => (
          <RenderCellPermissions params={params} onClick={onPermissionClick} />
        ),
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
              <GridActionsLinkItem
                showInMenu
                icon={<Iconify icon="solar:pen-bold" />}
                label="Chỉnh sửa"
                href={paths.role.edit(params.row.id)}
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
  return [
    {
      field: 'name',
      headerName: 'Nhóm quyền',
      flex: 1,
      minWidth: 360,
      hideable: false,
    },

    {
      field: 'permissions',
      headerName: 'Quyền hạn',
      filterable: false,
      width: 200,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => <RenderCellPermissions params={params} onClick={onPermissionClick} />,
    },
  ];
};

// ----------------------------------------------------------------------

type ParamsProps = {
  params: GridCellParams;
};

export function RenderCellPermissions({ params, onClick }: ParamsProps & { onClick: any }) {
  return (
    <Button
      variant="text"
      color="info"
      onClick={(event) => onClick(event, params.row.permissions)}
      disableRipple
      disabled={!params.row.permissions?.length}
    >
      {params.row.permissions?.length || 0} quyền
    </Button>
  );
}
