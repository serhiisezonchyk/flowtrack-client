import { cn, errorHandler } from '@/lib/utils';
import { useCreateTask } from '@/queries/task.query';
import { SectionType, TaskType } from '@/types';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Plus, Trash } from 'lucide-react';
import React, { useMemo } from 'react';
import { toast } from 'react-toastify';
import AlertButton from './AlertButton';
import SingleTask from './SingleTask';
import { Button } from './ui/button';
interface KanbanColumnProps {
  section: SectionType;
  className?: string;
  tasks: TaskType[];
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ section, className, tasks }) => {
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

  const singleTasksPosition = useMemo(() => tasks.map((el) => el.id), [tasks]);

  const handleSuccess = () => {
    toast.success('New task was added');
  };
  const handleError = (e: any) => {
    const error = errorHandler(e);
    toast.error(error.error);
  };

  const { mutate: createTask, isPending: isCreateTaskPending } = useCreateTask({
    onSuccess: handleSuccess,
    onError: handleError,
  });
  if (isDragging)
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={cn('w-full sm:min-w-[350px] sm:w-[350px] bg-slate-100 rounded-md opacity-50 min-h-[170px]', className)}
      ></div>
    );
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={cn('w-full sm:min-w-[350px] sm:w-[350px] bg-slate-100 rounded-md min-h-[170px] ', className)}
    >
      {/* Header */}
      <div {...listeners} className={cn(`m-2 px-4 py-2 border-b-2 flex flex-row justify-between items-center`)}>
        <h3 className="">{section.title}</h3>
        <div className="flex flex-row gap-4">
          <Button
            variant={'ghost'}
            size="icon"
            disabled={isCreateTaskPending}
            onClick={() => {
              createTask(section.id);
            }}
            className="hover:bg-slate-300/40"
          >
            <span className="sr-only">Add task</span>
            <Plus stroke="gray" size={20} cursor="pointer" />
          </Button>
          <AlertButton
            title="Are you absolutely sure?"
            description="This action cannot be undone. This will permanently delete your column."
            actionTrigger={() => {}}
          >
            <Button variant={'ghost'} size="icon" className="hover:bg-slate-300/40">
              <span className="sr-only">Delete column</span>
              <Trash stroke="gray" size={20} cursor="pointer" />
            </Button>
          </AlertButton>
        </div>
      </div>

      {/* Tasks */}
      <div className="block">
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
