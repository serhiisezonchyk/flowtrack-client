import AlertButton from '@/components/AlertButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { errorHandler } from '@/lib/utils';
import { useTask, useTaskUpdate } from '@/queries/task.query';
import TaskService from '@/services/task.service';
import { TaskType } from '@/types';
import { TaskUpdateSchemaType } from '@/validation/schemas';
import MDEditor from '@uiw/react-md-editor';
import dayjs from 'dayjs';
import { Loader2, Pen, Save, Trash2, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

interface TaskViewProps {
  task: TaskType;
  onEdit: () => void;
  slug: string;
}

const TaskView: React.FC<TaskViewProps> = ({ task, onEdit, slug }) => {
  const navigate = useNavigate();
  const handleClickDelete = async (taskId: string) => {
    try {
      await TaskService.deleteTask(taskId);
      navigate(`/my-boards/${slug}`);
    } catch (e) {
      toast.error(errorHandler(e).error);
    }
  };
  return (
    <>
      <div className="border-b-2 border-b-gray-300">
        <div className="flex justify-between items-center">
          <h1 className="text-xl">{task.title}</h1>
          <div>
            <Button variant="ghost" size="icon" onClick={onEdit}>
              <span className="sr-only">Enable edit mode</span>
              <Pen size={24} stroke="gray" />
            </Button>
            <AlertButton
              title="Are you absolutely sure?"
              description="This action cannot be undone. This will permanently delete your board."
              actionTrigger={() => handleClickDelete(task.id)}
            >
              <Button variant="ghost" size="icon">
                <span className="sr-only">Delete board</span>
                <Trash2 stroke="red" size={24} cursor="pointer" />
              </Button>
            </AlertButton>
          </div>
        </div>
        <p className="text-gray-300 mb-2">{dayjs(task.createdAt).format('DD/MM/YYYY')}</p>
      </div>

      <div className="h-full mt-2 prose">
        <MDEditor.Markdown source={task.content} />
      </div>
    </>
  );
};

interface TaskEditProps {
  task: TaskType;
  onCancel: () => void;
  onSave: (taskId: string, newData: TaskUpdateSchemaType) => void;
}
const TaskEdit: React.FC<TaskEditProps> = ({ task, onCancel, onSave }) => {
  const [data, setData] = useState({
    title: '',
    content: '',
  });

  useEffect(() => {
    if (task) {
      setData({
        title: task.title,
        content: task.content,
      });
    }
  }, [task]);
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Esc':
        case 'Escape':
          onCancel();
          break;

        default:
          return;
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  const handleInputChange = (field: string, value: string) => {
    setData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <>
      <div className="border-b-2 border-b-gray-300">
        <div className="flex justify-between mb-2 items-center gap-2">
          <Input
            value={data.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className="border-none m-0 text-xl p-0 outline-none focus-visible:ring-0"
          />
          <div className="flex flex-nowrap">
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-slate-300/40 active:bg-slate-300/40"
              onClick={onCancel}
            >
              <span className="sr-only">Cancel</span>
              <X stroke="gray" size={24} cursor="pointer" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-slate-300/40 active:bg-slate-300/40"
              onClick={() => onSave(task.id, data)}
            >
              <span className="sr-only">Save changes</span>
              <Save stroke="gray" size={24} cursor="pointer" />
            </Button>
          </div>
        </div>
      </div>

      <div className="h-full mt-2 prose">
        <MDEditor
          value={data.content}
          preview="edit"
          onChange={(_, state) => handleInputChange('content', state?.target.value || '')}
        />
      </div>
    </>
  );
};

const SingleTaskPage = () => {
  const { slug, taskId } = useParams();

  if (!taskId || !slug) return <Navigate to={`/my-board/${slug}`} />;
  const { data: task, isFetching: isTaskLoading } = useTask(taskId);

  const [editMode, setEditMode] = useState(false);

  if (!taskId) return <Navigate to={`/my-boards/${slug}`} />;

  const handleEditModeToggle = () => {
    setEditMode((prev) => !prev);
  };

  const { mutate: updateTask } = useTaskUpdate();
  const handleSave = (taskId: string, newData: TaskUpdateSchemaType) => {
    updateTask({ taskId, newData });
  };
  if (isTaskLoading)
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );

  if (!task) return <Navigate to={`/my-boards/${slug}`} />;
  return (
    <div className="py-4">
      <div className="container">
        {editMode ? (
          <TaskEdit task={task} onCancel={handleEditModeToggle} onSave={handleSave} />
        ) : (
          <TaskView task={task} onEdit={handleEditModeToggle} slug={slug} />
        )}
      </div>
    </div>
  );
};

export default SingleTaskPage;
