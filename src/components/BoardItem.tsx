import { Board } from '@/types';
import React from 'react';
import { Link } from 'react-router-dom';

interface BoardItemProps {
  board: Board;
}
const BoardItem: React.FC<BoardItemProps> = ({ board }) => {
  return (
    <Link
      to={`/my-boards/${board.slug}`}
      key={board.id}
      className='bg-muted/40 px-4 py-2 rounded-xl transition-all duration-300 ease-out hover:bg-muted/70 h-10 w-full'
    >
      {board.icon} | {board.title}
    </Link>
  );
};

export default BoardItem;
