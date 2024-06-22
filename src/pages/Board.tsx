import AddBoardDialog from '@/components/AddBoardDialog';
import BoardList from '@/components/BoardList';
import { Button } from '@/components/ui/button';
import BoardService from '@/services/board.service';
import { useQuery } from '@tanstack/react-query';

import { Loader2, PlusSquare } from 'lucide-react';
import React, { useMemo } from 'react';

const Board: React.FC = () => {
  const { data: boards, isFetching } = useQuery({
    queryKey: ['boards'],
    queryFn: BoardService.getBoards,
    initialData: [],
  });

  const savedBoards = useMemo(
    () => boards.filter((el) => el.isSaved === true),
    [boards]
  );
  const privateBoards = useMemo(
    () => boards.filter((el) => el.isSaved === false),
    [boards]
  );
  if (isFetching)
    return (
      <div className='h-full grid items-center justify-center'>
        <Loader2 size={48} className='animate-spin' />
      </div>
    );
  return (
    <div>
      {/* Page description/navigation */}
      <div className='py-4'>
        <div className='container'>
          <div className='flex flex-row gap-4 w-full justify-between'>
            <h1 className='text-3xl'>My boards</h1>
            <div className='flex flex-row'>
              <AddBoardDialog />
            </div>
          </div>
        </div>
      </div>

      {/* List of Boards */}
      <BoardList boards={savedBoards} label='Favourite' />
      <BoardList boards={privateBoards} label='Private' />
    </div>
  );
};

export default Board;
