import { BoardType } from '@/types';
import React from 'react';
import BoardItem from './BoardItem';

interface BoardListType {
  boards: BoardType[];
  label: string;
}
const BoardList: React.FC<BoardListType> = ({ boards, label }) => {
  return (
    boards.length !== 0 && (
      <div className='py-4'>
        <div className='container'>
          <p className='text-xl mb-2'>{label}</p>
          <div className='flex sm:flex-wrap flex-col gap-4'>
            {boards.map((el) => (
              <BoardItem key={el.id} board={el} />
            ))}
          </div>
        </div>
      </div>
    )
  );
};

export default BoardList;
