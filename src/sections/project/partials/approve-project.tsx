import type { Project } from 'src/types/project';

import { toast } from 'sonner';
import { useBoolean } from 'minimal-shared/hooks';

import LoadingButton from '@mui/lab/LoadingButton';

import { shortenTextInMiddle } from 'src/utils/format-string';

import { approveProject } from 'src/actions/project-ssr';

import { ConfirmDialog } from 'src/components/custom-dialog';

import useProjectActionPermit from '../hooks/use-project-action-permit';

type Props = {
  project: Project;
};
export default function ApproveProject({ project }: Props) {
  const { approvePermit } = useProjectActionPermit(project?.status || '');

  const isProcessing = useBoolean();

  const confirming = useBoolean();

  const handleApprove = async () => {
    if (!project) return;
    try {
      isProcessing.onTrue();
      await approveProject(project.id);
      toast.success(`Dự án ${shortenTextInMiddle(project.name, 30)} duyệt thành công.`);
    } catch {
      toast.error('Đã có lỗi xảy ra.');
    } finally {
      confirming.onFalse();
      isProcessing.onFalse();
    }
  };

  if (!approvePermit) return null;
  return (
    <>
      <LoadingButton
        loading={isProcessing.value}
        onClick={confirming.onTrue}
        variant="soft"
        color="primary"
      >
        Duyệt dự án
      </LoadingButton>
      <ConfirmDialog
        open={confirming.value}
        onClose={confirming.onFalse}
        closeAfterTransition
        title="Xác nhận duyệt dự án này?"
        content={
          <>
            Xác nhận <u>duyệt dự án</u> <strong>{project?.name}</strong>? Lưu ý, thao này không thể
            hoàn tác.
          </>
        }
        action={
          <LoadingButton
            variant="outlined"
            color="primary"
            loading={isProcessing.value}
            onClick={handleApprove}
          >
            Duyệt
          </LoadingButton>
        }
      />
    </>
  );
}
