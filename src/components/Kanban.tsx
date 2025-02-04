import { errorHandler } from '@/lib/utils';
import { useCreateSection, useSections } from '@/queries/section.queries';
import { useBoardStore } from '@/store/board.store';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import KanbanSections, { KanbanSectionsSkeleton } from './KanbanSections';
import { Button } from './ui/button';

interface KanbanProps {}
const Kanban: React.FC<KanbanProps> = () => {
  const boardId = useBoardStore((state) => state.currentBoardId) as string;
  const sectionsCount = useBoardStore((state) => state.sectionsCount);
  const setSectionCount = useBoardStore((state) => state.setSectionsCount);

  const { data, isPending: isSectionsPending, isError: isSectionsError, error: sectionError } = useSections(boardId);

  const { mutate: createSection, isPending: isCreateSectionPending } = useCreateSection();

  useEffect(() => {
    if (data) {
      setSectionCount(data.length);
    }
  }, [data]);

  if (isSectionsError) {
    const errorData = errorHandler(sectionError);
    toast.error(errorData.error);
  }
  return (
    <div>
      {/* Separator / Add button */}
      <div className="border-b border-b-gray-300">
        <div className="container">
          <div className="mt-2 pb-2 flex flex-row justify-between items-center">
            <Button
              variant='outline'
              className="text-[16px]"
              disabled={isCreateSectionPending}
              onClick={() => createSection(boardId)}
            >
              Add section
            </Button>
            <p>{sectionsCount} sections</p>
          </div>
        </div>
      </div>
      {/* sections */}
      {isSectionsPending ? (
        <KanbanSectionsSkeleton />
      ) : (
        data && <KanbanSections data={structuredClone(data)} boardId={boardId} />
      )}
    </div>
  );
};

export default Kanban;
