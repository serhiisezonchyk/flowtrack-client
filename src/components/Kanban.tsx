import React, { useEffect } from 'react';
import { Button } from './ui/button';
import KanbanSections, { KanbanSectionsSkeleton } from './KanbanSections';
import { useBoardStore } from '@/store/board.store';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import SectionService from '@/services/section.service';
import { toast } from 'react-toastify';
import { errorHandler } from '@/lib/utils';

interface KanbanProps {}
const Kanban: React.FC<KanbanProps> = () => {
  const queryClient = useQueryClient();

  const boardId = useBoardStore((state) => state.currentBoardId) as string;
  const sectionsCount = useBoardStore((state) => state.sectionsCount);
  const setSectionCount = useBoardStore((state) => state.setSectionsCount);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['section', boardId],
    queryFn: () => SectionService.getSections(boardId),
    enabled: !!boardId,
  });

  const { mutate: addSection, isPending: isAddingSection } = useMutation({
    mutationKey: ['Create section'],
    mutationFn: async (boardId: string) =>
      SectionService.createSection(boardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['section'] });
      toast.success('New section was added');
    },
    onError: (e) => {
      const error = errorHandler(e);
      toast.error(error.error);
    },
  });
  useEffect(() => {
    if (data) {
      setSectionCount(data.length);
    }
  }, [data]);
  if (isError) {
    const errorData = errorHandler(error);
    toast.error(errorData.error);
  }
  return (
    <div>
      {/* Separator / Add button */}
      <div className='border-b border-b-gray-300'>
        <div className='container'>
          <div className='mt-2 pb-2 flex flex-row justify-between items-center'>
            <Button
              variant='ghost'
              className='text-[16px] text-cyan-800 hover:text-cyan-800'
              disabled={isAddingSection}
              onClick={() => addSection(boardId)}
            >
              Add section
            </Button>
            <p>{sectionsCount} sections</p>
          </div>
        </div>
      </div>
      {/* sections */}
      {isPending ? (
        <KanbanSectionsSkeleton />
      ) : (
        !isError && <KanbanSections data={data} />
      )}
    </div>
  );
};

export default React.memo(Kanban);
