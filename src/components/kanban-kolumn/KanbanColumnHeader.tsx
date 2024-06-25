import { errorHandler } from '@/lib/utils';
import { useChangeSectionTitle, useDeleteSection } from '@/queries/section.queries';
import { useCreateTask } from '@/queries/task.query';
import { SectionType } from '@/types';
import { Pen, Plus, Trash, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import AlertButton from '../AlertButton';
import { Button } from '../ui/button';

interface KanbanColumnHeaderProps {
  section: SectionType;
  boardId: string;
}
const KanbanColumnHeader: React.FC<KanbanColumnHeaderProps> = ({ section, boardId }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const editedTitleRef = useRef(section.title);

  const handleError = (e: any) => {
    const error = errorHandler(e);
    toast.error(error.error);
  };

  const { mutate: createTask, isPending: isCreateTaskPending } = useCreateTask({
    boardId,
    onSuccess: () => toast.success('Board was deleted'),
    onError: handleError,
  });

  const { mutate: deleteSection } = useDeleteSection({
    boardId,
    onSuccess: () => toast.success('Board was deleted'),
    onError: handleError,
  });

  const { mutate: changeTitle } = useChangeSectionTitle({
    boardId,
  });

  const handleSave = () => {
    changeTitle({ sectionId: section.id, newData: { title: editedTitleRef.current } });
    setIsEditMode(false);
  };

  const handleCancel = () => {
    setIsEditMode(false);
  };
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Esc':
        case 'Escape':
          handleCancel();
          break;
        case 'Enter': {
          handleSave();
          break;
        }
        default:
          return;
      }
    };

    if (isEditMode) {
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.removeEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isEditMode]);
  return (
    <>
      <div className="relative">
        {!isEditMode && (
          <div
            className="absolute -left-8 -top-8 rounded-full bg-white p-2 transition-all duration-300 ease-out text-gray-400 hover:text-gray-500 active:text-gray-500"
            onClick={() => setIsEditMode(true)}
          >
            <Pen size={18} />
          </div>
        )}

        {!isEditMode ? (
          <h3 className="border-b-[1px] border-b-transparent">{section.title}</h3>
        ) : (
          <input
            autoFocus
            className="bg-slate-100 border-b-[1px] border-b-gray-200 outline-none"
            defaultValue={section.title}
            onChange={(e) => {
              editedTitleRef.current = e.target.value;
            }}
          />
        )}
      </div>

      <div className="flex flex-row gap-4">
        {!isEditMode ? (
          <>
            <Button
              variant={'ghost'}
              size="icon"
              disabled={isCreateTaskPending}
              onClick={() => {
                createTask(section.id);
              }}
              className="hover:bg-slate-300/40 active:bg-slate-300/40"
            >
              <span className="sr-only">Add task</span>
              <Plus stroke="gray" size={20} cursor="pointer" />
            </Button>
            <AlertButton
              title="Are you absolutely sure?"
              description="This action cannot be undone. This will permanently delete your column."
              actionTrigger={() => {
                deleteSection(section.id);
              }}
            >
              <Button variant={'ghost'} size="icon" className="hover:bg-slate-300/40 active:bg-slate-300/40">
                <span className="sr-only">Delete column</span>
                <Trash stroke="gray" size={20} cursor="pointer" />
              </Button>
            </AlertButton>
          </>
        ) : (
          <>
            <Button
              variant={'ghost'}
              size="icon"
              className="hover:bg-slate-300/40 active:bg-slate-300/40"
              onClick={handleCancel}
            >
              <span className="sr-only">Cancel</span>
              <X stroke="gray" size={20} cursor="pointer" />
            </Button>
            <Button
              variant={'ghost'}
              size="icon"
              className="hover:bg-slate-300/40 active:bg-slate-300/40"
              onClick={handleSave}
            >
              <span className="sr-only">Save changes</span>
              <Pen stroke="gray" size={20} cursor="pointer" />
            </Button>
          </>
        )}
      </div>
    </>
  );
};

export default React.memo(KanbanColumnHeader);
