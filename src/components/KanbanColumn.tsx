import React, { useEffect, useMemo, useState } from 'react';
import TooltipIconButton from './TooltipIconButton';
import { Plus, Trash } from 'lucide-react';
import SingleTask from './SingleTask';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn, errorHandler } from '@/lib/utils';
import { SectionType, TaskType } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import TaskService from '@/services/task.service';
import { toast } from 'react-toastify';
interface KanbanColumnProps {
  section: SectionType;
  className?: string;
  tasks: TaskType[];
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  section,
  className,
  tasks,
}) => {
  const queryClient = useQueryClient();

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: section.id,
    data: {
      type: 'Section',
      section,
    },
  });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const singleTasksPosition = useMemo(() => tasks.map((el) => el.id), [tasks]);
  
  const { mutate: addTask, isPending: isTaskAdding } = useMutation({
    mutationKey: ['Create task'],
    mutationFn: async (sectionId: string) => TaskService.createTask(sectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['section'] });
      toast.success('New task was added');
    },
    onError: (e) => {
      const error = errorHandler(e);
      toast.error(error.error);
    },
  });
  if (isDragging)
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={cn(
          'w-full sm:w-[350px] bg-slate-100 rounded-md opacity-50',
          className
        )}
      ></div>
    );
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={cn('w-full sm:w-[350px] bg-slate-100 rounded-md', className)}
    >
      {/* Header */}
      <div
        {...listeners}
        className={cn(
          `m-2 px-4 py-2 border-b-2 flex flex-row justify-between items-center`
        )}
      >
        <h3 className=''>{section.title}</h3>
        <div className='flex flex-row gap-4'>
          <TooltipIconButton
            isPending={isTaskAdding}
            tooltip='Add new task'
            onClick={() => {
              addTask(section.id);
            }}
            className='hover:bg-slate-300/40'
          >
            <Plus stroke='gray' size={20} cursor='pointer' />
          </TooltipIconButton>
          <TooltipIconButton
            tooltip='Delete column'
            isPending={false}
            onClick={() => {}}
            className='hover:bg-slate-300/40'
          >
            <Trash stroke='gray' size={20} cursor='pointer' />
          </TooltipIconButton>
        </div>
      </div>

      {/* Tasks */}
      <div className='block'>
        <SortableContext items={singleTasksPosition}>
          {tasks.map((el) => (
            <SingleTask key={el.id} task={el} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};

export default KanbanColumn;
