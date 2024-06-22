import { BoardType } from '@/types';
import { create } from 'zustand';
type BoardState = {
  currentBoardId: string | null;
  sectionsCount: number;
};
type BoardActions = {
  setCurrentBoardId: (id: string | null) => void;
  setSectionsCount: (id: number) => void;
};
type BoardSlice = BoardState & BoardActions;
export const useBoardStore = create<BoardSlice>((set) => ({
  currentBoardId: null,
  sectionsCount: 0,
  setCurrentBoardId: (id) => set({ currentBoardId: id }),
  setSectionsCount: (sectionsCount) => set({ sectionsCount }),
}));
