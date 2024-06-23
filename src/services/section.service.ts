import { $authHost } from '@/services';
import { SectionType } from '@/types';
interface GetSectionsResponse {
  data: SectionType[];
}
interface GetResponseWithMessage {
  message: string;
  data: SectionType;
}
export default class SectionService {
  static getSections = async (boardId: string) => {
    const { data } = await $authHost.get<GetSectionsResponse>(`/section/${boardId}`);
    return data.data;
  };
  static createSection = async (boardId: string) => {
    const { data } = await $authHost.post<GetResponseWithMessage>(`/section/${boardId}`);
    return data.data;
  };
  static changeSectionPositions = async (boardId: string, newData: SectionType[]) => {
    const data = await $authHost.put<GetResponseWithMessage>(`/section/update-section-position/${boardId}`,newData);
    return data.data;
  };
}
