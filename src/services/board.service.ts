import { $authHost } from '@/services';
import { BoardType, ResponseType } from '@/types';
import { CreateBoardSchemaType, UpdateBoardSchemaType } from '@/validation/schemas';

export interface GetBoardResponse {
  data: BoardType;
}
export interface ChangeIsSavedResponse {
  message: string;
  data: BoardType;
}
export default class BoardService {
  static getBoards = async () => {
    const { data } = await $authHost.get<Omit<ResponseType<BoardType[]>, 'message'>>('/board');
    return data.data;
  };
  static getBoard = async (slug: string) => {
    const { data } = await $authHost.get<Omit<ResponseType<BoardType>, 'message'>>(`/board/${slug}`);
    return data.data;
  };
  static changeIsSaved = async (id: string) => {
    const { data } = await $authHost.patch<ResponseType<BoardType>>(`board/${id}`);
    return data;
  };
  static createBoard = async (newData: CreateBoardSchemaType) => {
    const { data } = await $authHost.post<ResponseType<BoardType>>(`board`, newData);
    return data;
  };
  static deleteBoard = async (id: string) => {
    const { data } = await $authHost.delete<Omit<ResponseType, 'data'>>(`board/${id}`);
    return data;
  };
  static updateBoard = async (boardId: string, newData: UpdateBoardSchemaType) => {
    const { data } = await $authHost.put<ResponseType<BoardType>>(`/board/${boardId}`, newData);
    return data.data;
  };
}
