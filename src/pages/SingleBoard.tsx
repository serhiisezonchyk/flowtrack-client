import AlertButton from '@/components/AlertButton';
import EmojiPicker from '@/components/EmojiPicker';
import Input from '@/components/Input';
import Kanban from '@/components/Kanban';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { errorHandler } from '@/lib/utils';
import { useBoard, useChangeBoardSaved } from '@/queries/board.queries';
import BoardService from '@/services/board.service';
import { useBoardStore } from '@/store/board.store';
import { Heart, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const SingleBoard = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  if (!slug) return;

  const setBoardId = useBoardStore((state) => state.setCurrentBoardId);

  const { data: board, isLoading: isBoardLoading } = useBoard(slug);
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
  const [boardData, setBoardData] = useState({
    icon: '',
    title: '',
    description: '',
  });
  useEffect(() => {
    if (board) {
      setBoardId(board.id);
      setBoardData({
        icon: board.icon,
        title: board.title,
        description: board.description,
      });
    }
    return () => {
      setBoardId(null);
    };
  }, [board]);
  const onIconChange = useCallback((newIcon: string) => {
    setBoardData((prevData) => ({ ...prevData, icon: newIcon }));
  }, []);
  return (
    <div>
      {/* Main info */}
      <div className="py-4">
        <div className="container">
          <div className="space-y-4">
            {/* Actions/emojis */}
            <div className="w-full flex flex-row justify-between items-center">
              {!isBoardLoading ? (
                <EmojiPicker icon={boardData.icon} onChange={onIconChange} />
              ) : (
                <Skeleton className="size-9 rounded-full" />
              )}
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
                value={boardData.title}
                className="border-none mb-0 text-2xl px-0"
                onChange={(e) =>
                  setBoardData((prevData) => ({
                    ...prevData,
                    title: e.target.value,
                  }))
                }
              />
            )}

            {/* Description */}
            {isBoardLoading ? (
              <Skeleton className="border-none resize-none px-0 w-full h-20" />
            ) : (
              <Textarea
                className="border-none resize-none px-0"
                defaultValue={boardData.description}
                disabled={isBoardLoading}
                onChange={(e) =>
                  setBoardData((prevData) => ({
                    ...prevData,
                    description: e.target.value,
                  }))
                }
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
