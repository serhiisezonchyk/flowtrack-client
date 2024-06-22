import EmojiPicker from '@/components/EmojiPicker';
import Input from '@/components/Input';
import Kanban from '@/components/Kanban';
import TooltipIconButton from '@/components/TooltipIconButton';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import BoardService from '@/services/board.service';
import { useBoardStore } from '@/store/board.store';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Star, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const SingleBoard = () => {
  const queryClient = useQueryClient();
  const { slug } = useParams();

  const setBoardId = useBoardStore((state) => state.setCurrentBoardId);

  const { data, isLoading } = useQuery({
    queryKey: ['board', slug],
    queryFn: () => BoardService.getBoard(slug as string),
    enabled: !!slug,
  });
  const { mutate: changeIsSaved, isPending: isIsSavedPending } = useMutation({
    mutationKey: ['Change isSaved'],
    mutationFn: async (id: string) => BoardService.changeIsSaved(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['board', slug] });
    },
  });
  const [boardData, setBoardData] = useState({
    icon: '',
    title: '',
    description: '',
  });
  useEffect(() => {
    if (data) {
      setBoardId(data.id);
      setBoardData({
        icon: data.icon,
        title: data.title,
        description: data.description,
      });
    }
    return () => {
      setBoardId(null);
    };
  }, [data]);
  const onIconChange = useCallback((newIcon: string) => {
    setBoardData((prevData) => ({ ...prevData, icon: newIcon }));
  }, []);
  return (
    <div>
      {/* Main info */}
      <div className='py-4'>
        <div className='container'>
          <div className='space-y-4'>
            {/* Actions/emojis */}
            <div className='w-full flex flex-row justify-between items-center'>
              {!isLoading ? (
                <EmojiPicker icon={boardData.icon} onChange={onIconChange} />
              ) : (
                <Skeleton className='size-9 rounded-full' />
              )}
              <div className='flex flex-row gap-8'>
                <Button
                  variant={'ghost'}
                  size='icon'
                  disabled={isIsSavedPending}
                  onClick={() => {
                    changeIsSaved(data?.id as string);
                  }}
                >
                  <Star
                    stroke='gray'
                    fill={data?.isSaved ? 'yellow' : 'transparent'}
                    size={24}
                    cursor='pointer'
                  />
                </Button>
                <TooltipIconButton
                  tooltip='Remove board'
                  isPending={false}
                  onClick={() => {}}
                >
                  <Trash2 stroke='red' size={24} cursor='pointer' />
                </TooltipIconButton>
              </div>
            </div>

            {/* Title */}
            {isLoading ? (
              <Skeleton className='border-none mb-0 text-2xl px-0 w-full h-12' />
            ) : (
              <Input
                value={boardData.title}
                className='border-none mb-0 text-2xl px-0'
                onChange={(e) =>
                  setBoardData((prevData) => ({
                    ...prevData,
                    title: e.target.value,
                  }))
                }
              />
            )}

            {/* Description */}
            {isLoading ? (
              <Skeleton className='border-none resize-none px-0 w-full h-20' />
            ) : (
              <Textarea
                className='border-none resize-none px-0'
                defaultValue={boardData.description}
                disabled={isLoading}
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
