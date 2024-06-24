import { TaskType } from '@/types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Minus } from 'lucide-react';
import React from 'react';
import { Button } from './ui/button';

interface SingleTaskProps {
  task: TaskType;
}
const SingleTask: React.FC<SingleTaskProps> = ({ task }) => {
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task,
    },
  });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging)
    return <div ref={setNodeRef} className="m-2 px-4 py-2 bg-slate-300/40 rounded-md h-10 backdrop-blur-lg"></div>;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      data-task-id={task.id}
      className="m-2 px-4 py-2 bg-slate-300/40 rounded-md cursor-pointer hover:bg-slate-300/70 active:bg-slate-300/70 duration-300 transition-all ease-out h-10 relative group overflow-hidden"
    >
      {task.title}
      <Button variant={'ghost'} size={'icon'} className="absolute right-0 top-0 rounded-l-none hover:bg-slate-300 active:bg-slate-300" data-delete-task>
        <Minus size={20} className="text-gray-600" />
      </Button>
    </div>
  );
};

export default SingleTask;
