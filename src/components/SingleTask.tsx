import { useSortable } from '@dnd-kit/sortable';
import React from 'react';
import { CSS } from '@dnd-kit/utilities';
import { TaskType } from '@/types';

interface SingleTaskProps {
  task: TaskType;
}
const SingleTask: React.FC<SingleTaskProps> = ({ task }) => {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
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
    return (
      <div
        ref={setNodeRef}
        className='m-2 px-4 py-2 bg-slate-300/40 rounded-md h-10 backdrop-blur-lg'
      ></div>
    );

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className='m-2 px-4 py-2 bg-slate-300/40 rounded-md cursor-pointer hover:bg-slate-300/70 duration-300 transition-all ease-out h-10'
    >
      {task.title}
    </div>
  );
};

export default SingleTask;
