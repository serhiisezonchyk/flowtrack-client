import AlertButton from '@/components/AlertButton';
import EmojiPicker from '@/components/board-info/EmojiPicker';
import Input from '@/components/Input';
import Kanban from '@/components/Kanban';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { errorHandler } from '@/lib/utils';
import { useBoard, useChangeBoardSaved, useUpdateBoard } from '@/queries/board.queries';
import BoardService from '@/services/board.service';
import { useBoardStore } from '@/store/board.store';
import debounce from 'lodash.debounce';
import { Heart, Trash2 } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const SingleBoard = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('');

  if (!slug) return;
  const { data: board, isLoading: isBoardLoading } = useBoard(slug);
  const setBoardId = useBoardStore((state) => state.setCurrentBoardId);

  const { mutate: changeIsSaved, isPending: isChangeIsSavedPending } = useChangeBoardSaved({
    slug,
  });

  const handleDeleteBoard = useCallback(async (id: string) => {
    try {
      await BoardService.deleteBoard(id);
      toast.success(`Board was deleted successfully`);
      navigate('/my-boards');
    } catch (e) {
      const error = errorHandler(e);
      toast.error(error.error);
    }
  }, []);

  useEffect(() => {
    if (board) {
      setBoardId(board.id);

      setTitle(board.title);
      setDescription(board.description);
      setIcon(board.icon);
    }
    return () => {
      setBoardId(null);
    };
  }, [board]);

  const { mutate: updateBoard } = useUpdateBoard(slug);
  const onIconChange = (data: string) => {
    setIcon(data);
    updateBoard({ boardId: board?.id as string, newData: { icon: data } });
  };

  const debounceTitleChange = React.useRef(
    debounce((data: string, boardId: string) => {
      updateBoard({ boardId, newData: { title: data } });
    }, 1000),
  ).current;

  const debounceDescriptionChange = React.useRef(
    debounce((data: string, boardId: string) => {
      updateBoard({ boardId, newData: { description: data } });
    }, 1000),
  ).current;

  const onTitleChange = (data: string) => {
    setTitle(data);
    debounceTitleChange(data, board?.id as string);
  };

  useEffect(() => {
    return () => {
      debounceTitleChange.cancel();
      debounceDescriptionChange.cancel();
    };
  }, [debounceTitleChange, debounceDescriptionChange]);

  const onDescriptionChange = (data: string) => {
    setDescription(data);
    debounceDescriptionChange(data, board?.id as string);
  };
  if (!isBoardLoading && !board) return <Navigate to={'/my-boards'} />;

  return (
    <div>
      {/* Main info */}
      <div className="py-4">
        <div className="container">
          <div className="space-y-4">
            {/* Actions/emojis */}
            <div className="w-full flex flex-row justify-between items-center">
              <EmojiPicker icon={icon} onChange={onIconChange} isBoardLoading={isBoardLoading} />
              <div className="flex flex-row gap-8">
                <Button
                  variant={'ghost'}
                  size="icon"
                  disabled={isChangeIsSavedPending}
                  onClick={() => {
                    changeIsSaved(board?.id as string);
                  }}
                >
                  <span className="sr-only">Save board</span>
                  <Heart stroke="red" fill={board?.isSaved ? 'red' : 'transparent'} size={24} cursor="pointer" />
                </Button>
                <AlertButton
                  title="Are you absolutely sure?"
                  description="This action cannot be undone. This will permanently delete your board."
                  actionTrigger={() => handleDeleteBoard(board?.id as string)}
                >
                  <Button variant={'ghost'} size="icon">
                    <span className="sr-only">Delete board</span>
                    <Trash2 stroke="red" size={24} cursor="pointer" />
                  </Button>
                </AlertButton>
              </div>
            </div>

            {/* Title */}
            {isBoardLoading ? (
              <Skeleton className="border-none mb-0 text-2xl px-0 w-full h-12" />
            ) : (
              <Input
                value={title}
                className="border-none mb-0 text-2xl px-0"
                onChange={(e) => onTitleChange(e.target.value)}
              />
            )}

            {/* Description */}
            {isBoardLoading ? (
              <Skeleton className="border-none resize-none px-0 w-full h-20" />
            ) : (
              <Textarea
                className="border-none resize-none px-0"
                defaultValue={description}
                disabled={isBoardLoading}
                onChange={(e) => onDescriptionChange(e.target.value)}
              />
            )}
          </div>
        </div>
        <Kanban />
      </div>
    </div>
  );
};

export default SingleBoard;
