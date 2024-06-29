import AddBoardDialog from '@/components/AddBoardDialog';
import BoardList from '@/components/BoardList';
import { useBoards } from '@/queries/board.queries';

import { Loader2 } from 'lucide-react';
import React, { useMemo } from 'react';

const Board: React.FC = () => {
  const { data: boards, isFetching: isBoardsFetching } = useBoards();

  const savedBoards = useMemo(() => boards?.filter((el) => el.isSaved === true) || [], [boards]);
  const privateBoards = useMemo(() => boards?.filter((el) => el.isSaved === false) || [], [boards]);
  if (isBoardsFetching)
    return (
      <div className="h-full grid items-center justify-center">
        <Loader2 size={48} className="animate-spin" />
      </div>
    );
  return (
    <div>
      {/* Page description/navigation */}
      <div className="py-4">
        <div className="container">
          <div className="flex flex-row gap-4 w-full justify-between">
            <h1 className="text-3xl">My boards</h1>
            <div className="flex flex-row">
              <AddBoardDialog />
            </div>
          </div>
        </div>
      </div>

      {/* List of Boards */}
      <BoardList boards={savedBoards} label="Favourite" />
      <BoardList boards={privateBoards} label="Private" />
    </div>
  );
};

export default Board;
