import { $authHost } from '@/services';
import { BoardType } from '@/types';
import { CreateBoardSchemaType } from '@/validation/schemas';
export interface GetBoardsResponse {
  data: BoardType[];
}
export interface GetBoardResponse {
  data: BoardType;
}
export interface ChangeIsSavedResponse {
  message: string;
  data: BoardType;
}
export default class BoardService {
  static getBoards = async () => {
    const { data } = await $authHost.get<GetBoardsResponse>('/board');
    return data.data;
  };
  static getBoard = async (slug: string) => {
    const { data } = await $authHost.get<GetBoardResponse>(`/board/${slug}`);
    return data.data;
  };
  static changeIsSaved = async (id: string) => {
    const { data } = await $authHost.patch<ChangeIsSavedResponse>(`board/${id}`);
    return data;
  };
  static createBoard = async (body: CreateBoardSchemaType) => {
    const { data } = await $authHost.post<ChangeIsSavedResponse>(`board`, body);
    return data;
  };
}
