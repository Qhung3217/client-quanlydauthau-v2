import type { Project, ProjectStatus } from 'src/types/project';

import { toast } from 'sonner';
import { useState } from 'react';
import { useBoolean } from 'minimal-shared/hooks';

import { Box, Pagination, paginationClasses } from '@mui/material';

import { useGetProjects } from 'src/actions/project';
import { deleteProject } from 'src/actions/project-ssr';

import { EmptyContent } from 'src/components/empty-content';
import TableQuickFilter from 'src/components/data-table/table-quick-filter';
import DeleteConfirmDialog from 'src/components/data-table/delete-confirm-dialog';

import ProjectItem from './project-item';
import ProjectStatusTab from './project-status-tab';
import { ProjectListSkeleton } from './project-skeleton';
import ProjectPreviewDialog from './project-preview-dialog';
import useProjectActions from './hooks/use-project-actions';

export default function ProjectList() {
  const [query, setQuery] = useState('');

  const [projectView, setProjectView] = useState<Project | null>(null);

  const [selectedRowId, setSelectedRowId] = useState<string>('');

  const [page, setPage] = useState(1);

  const [status, setStatus] = useState<ProjectStatus | 'ALL'>('ALL');

  const confirmDialog = useBoolean();

  const deleting = useBoolean();

  const { onApprove, onReject, onRequestEdit, renderConfirmDialog } = useProjectActions();

  const { projects, projectsMeta, projectsEmpty, projectsLoading } = useGetProjects({
    page,
    keyword: query,
    ...(status !== 'ALL' && {
      statuses: status,
    }),
  });

  const handleDeleteRow = async () => {
    try {
      deleting.onTrue();

      await deleteProject(selectedRowId);
      toast.success(`Xóa dự án thành công!`);
      setSelectedRowId('');

      confirmDialog.onFalse();
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    } finally {
      deleting.onFalse();
    }
  };

  const renderLoading = () => <ProjectListSkeleton variant="horizontal" />;

  const renderList = () =>
    projects.map((project) => (
      <ProjectItem
        key={project.id}
        project={project}
        detailsClick={(row) => {
          setProjectView(row);
        }}
        deleteClick={(id) => {
          confirmDialog.onTrue();
          setSelectedRowId(id);
        }}
        editClick={() => {}}
        approveClick={() => onApprove(project)}
        rejectClick={() => onReject(project)}
        requestEditClick={() => onRequestEdit(project)}
        // itemNotLink={itemNotLink}
      />
    ));

  return (
    <Box>
      <Box
        sx={{
          gap: 3,
          display: 'flex',
          mb: { xs: 3, md: 5 },
          justifyContent: 'space-between',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-end', sm: 'center' },
        }}
      >
        <TableQuickFilter value={query} onChange={setQuery} onReset={() => setQuery('')} />
      </Box>
      <ProjectStatusTab status={status} onChange={setStatus} />
      <Box
        sx={{
          gap: 3,
          display: 'grid',
          gridTemplateColumns: 'repeat(1, 1fr)',
        }}
      >
        {projectsLoading && !projectsEmpty ? renderLoading() : renderList()}
      </Box>
      {!projectsLoading && projectsEmpty && <EmptyContent title="Bạn chưa tạo dự án nào" />}
      {!projectsEmpty && (
        <Pagination
          count={projectsMeta?.totalPages || 0}
          page={page}
          onChange={(event, newPage) => setPage(newPage)}
          sx={{
            mt: { xs: 5, md: 8 },
            [`& .${paginationClasses.ul}`]: { justifyContent: 'center' },
          }}
        />
      )}
      <DeleteConfirmDialog
        open={confirmDialog.value}
        onClose={confirmDialog.onFalse}
        count={1}
        confirming={deleting.value}
        onConfirm={handleDeleteRow}
      />

      <ProjectPreviewDialog
        open={!!projectView}
        onClose={() => setProjectView(null)}
        project={projectView as any}
      />

      {renderConfirmDialog()}
    </Box>
  );
}
