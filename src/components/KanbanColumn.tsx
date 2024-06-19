import React, { useEffect, useMemo, useState } from 'react';
import TooltipIconButton from './TooltipIconButton';
import { Plus, Trash } from 'lucide-react';
import SingleTask from './SingleTask';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Section, Task } from '@/types';
import { cn } from '@/lib/utils';
interface KanbanColumnProps {
  section: Section;
  className?: string;
  tasks: Task[];
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  section,
  className,
  tasks,
}) => {
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

  const singleTasksPosition = useMemo(
    () => tasks.map((el) => el.id),
    [tasks]
  );
  
  if (isDragging)
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={cn(
          'w-full sm:min-w-[350px] bg-slate-100 rounded-md opacity-50',
          className
        )}
      ></div>
    );
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={cn(
        'w-full sm:min-w-[350px] bg-slate-100 rounded-md',
        className
      )}
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
            tooltip='Add new task'
            onClick={() => {}}
            className='hover:bg-slate-300/40'
          >
            <Plus stroke='gray' size={20} cursor='pointer' />
          </TooltipIconButton>
          <TooltipIconButton
            tooltip='Delete column'
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
