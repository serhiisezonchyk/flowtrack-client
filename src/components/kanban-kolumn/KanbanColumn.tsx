import { cn } from '@/lib/utils';
import { SectionType } from '@/types';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React, { useMemo } from 'react';
import SingleTask from '../SingleTask';
import KanbanColumnHeader from './KanbanColumnHeader';
interface KanbanColumnProps {
  section: SectionType;
  className?: string;
  boardId: string;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ section, className, boardId }) => {
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
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

  const singleTasksPosition = useMemo(() => section.tasks.map((el) => el.id), [section.tasks]);

  if (isDragging)
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={cn(
          'w-full sm:min-w-[350px] sm:w-[350px] bg-accent rounded-md opacity-50 min-h-[170px]',
          className,
        )}
      ></div>
    );
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={cn(
        'w-full sm:min-w-[350px] sm:w-[350px] bg-accent rounded-md min-h-[170px] touch-manipulation',
        className,
      )}
    >
      {/* Header */}
      <div {...listeners} className={cn(`m-2 px-4 py-2 border-b-2 border-b-border dark:border-b-background flex flex-row justify-between items-center`)}>
        <KanbanColumnHeader section={section} boardId={boardId} />
      </div>

      {/* Tasks */}
      <div className="block">
        <SortableContext items={singleTasksPosition}>
          {section.tasks.map((el) => (
            <SingleTask key={el.id} task={el} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};

export default KanbanColumn;
