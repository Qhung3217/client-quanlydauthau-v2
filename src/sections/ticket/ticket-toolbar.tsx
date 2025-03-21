'use client';

import type { BoxProps } from '@mui/material/Box';

import { useMemo } from 'react';
import { usePopover } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import {
  Menu,
  Button,
  MenuItem,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  CircularProgress,
} from '@mui/material';

import { useGetProjects } from 'src/actions/project';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = BoxProps & {
  setKeywordSearch: (keyword: string) => void;
  keyword: string;
  projectId: string;
  setProjectId: (projectId: string) => void;
  onToggleCompose: () => void;
};

export function TicketToolbar({
  keyword,
  sx,
  setKeywordSearch,
  projectId,
  onToggleCompose,
  setProjectId,
  ...other
}: Props) {
  const openProjectMenu = usePopover();

  const { projects, projectsLoading, projectsEmpty } = useGetProjects({
    perPage: Number.MAX_SAFE_INTEGER,
    isNotFetch: !openProjectMenu.open,
  });

  const projectValue = useMemo(() => {
    if (!projectId) return 'Tất cả dự án';
    const project = projects.find((p) => p.id === projectId);
    return project ? `#${project.code}` : 'Tất cả dự án';
  }, [projects, projectId]);

  return (
    <Box>
      <Box sx={{ display: 'flex', flex: 1, gap: 1, mt: 1, ...sx }} {...other}>
        <TextField
          placeholder="Tìm kiếm mã, tiêu đề ticket..."
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            },
          }}
          onChange={(event) => {
            setKeywordSearch(event.target.value);
          }}
          fullWidth
          size="small"
        />
        <Button
          color="inherit"
          variant="contained"
          onClick={onToggleCompose}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: 40,
            minWidth: 40,
          }}
        >
          <Iconify icon="solar:pen-bold" />
        </Button>
      </Box>
      <Box>
        <Label
          onClick={openProjectMenu.onOpen}
          sx={{ cursor: 'pointer' }}
          color={projectId ? 'info' : 'default'}
        >
          {projectValue as any}
          {!projectId ? (
            <Iconify icon="raphael:arrowdown" />
          ) : (
            <IconButton
              size="small"
              sx={{ color: 'error.main', p: 0.5 }}
              onClick={() => setProjectId('')}
            >
              <Iconify icon="carbon:close-filled" sx={{ width: 12, height: 12 }} />
            </IconButton>
          )}
        </Label>
      </Box>
      <Menu
        open={openProjectMenu.open}
        anchorEl={openProjectMenu.anchorEl}
        onClose={openProjectMenu.onClose}
      >
        {projectsLoading && (
          <MenuItem
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: 50,
              width: 1,
            }}
          >
            <CircularProgress color="secondary" />
          </MenuItem>
        )}
        {projectsEmpty && <MenuItem disabled>Không tìm thấy dự án</MenuItem>}
        {projects.map((project) => (
          <MenuItem
            key={project.id}
            sx={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start' }}
            onClick={() => {
              setProjectId(project.id);
              openProjectMenu.onClose();
            }}
          >
            <Typography variant="caption">#{project.code}</Typography>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              {project.name}
            </Typography>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}
