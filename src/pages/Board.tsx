import BoardList from '@/components/BoardList';
import { Button } from '@/components/ui/button';
import { boards as boardsData } from '@/mock';
import { Board as BoardType } from '@/types';

import { PlusSquare } from 'lucide-react';
import React, {  useMemo, useState } from 'react';

const Board: React.FC = () => {
  const [boards, setBoards] = useState<BoardType[]>(boardsData);
  const savedBoards = useMemo(
    () => boards.filter((el) => el.isSaved === true),
    [boards]
  );
  const privateBoards = useMemo(
    () => boards.filter((el) => el.isSaved === false),
    [boards]
  );
  return (
    <div>
      {/* Page description/navigation */}
      <div className='py-4'>
        <div className='container'>
          <div className='flex flex-row gap-4 w-full justify-between'>
            <h1 className='text-3xl'>My boards</h1>
            <div className='flex flex-row'>
              <Button variant='outline' className='p-2'>
                <PlusSquare size={24} fill='white' />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <BoardList boards={savedBoards} label='Favourite' />
      <BoardList boards={privateBoards} label='Private' />

      {/* Favourite */}
      <>
        {/* <div className='py-4'>
        <div className='container'>
          <p className='text-xl mb-2'>Favourite</p>
          <div className='flex sm:flex-wrap flex-col gap-4'>
            {savedBoards.map((el) => (
              <Link
                to={`/my-boards/${el.slug}`}
                key={el.id}
                className='bg-muted/40 px-4 py-2 rounded-xl relative transition-all duration-300 ease-out hover:bg-muted/70'
              >
                <p>
                  {el.icon} | {el.title}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div> */}
      </>
      {/* Private */}
      <>
        {' '}
        {/* <div className='py-4'>
        <div className='container'>
          <p className='text-xl mb-2'>Private</p>
          <div className='flex sm:flex-wrap flex-col gap-4'>
            {privateBoards.map((el) => (
              <Link
                to={`/my-boards/${el.slug}`}
                key={el.id}
                className='bg-muted/40 px-4 py-2 rounded-xl relative transition-all duration-300 ease-out hover:bg-muted/70'
              >
                <p>
                  {el.icon} | {el.title}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div> */}
      </>
    </div>
  );
};

export default Board;
