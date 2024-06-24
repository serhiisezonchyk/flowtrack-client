import { $authHost } from '@/services';
import { ResponseType, SectionType } from '@/types';

export default class SectionService {
  static getSections = async (boardId: string) => {
    const { data } = await $authHost.get<Omit<ResponseType<SectionType[]>, 'message'>>(`/section/${boardId}`);
    return data.data;
  };
  static createSection = async (boardId: string) => {
    const { data } = await $authHost.post<Omit<ResponseType<SectionType>, 'message'>>(`/section/${boardId}`);
    return data.data;
  };
  static changeSectionPositions = async (boardId: string, newData: SectionType[]) => {
    const data = await $authHost.put<Omit<ResponseType<SectionType>, 'message'>>(
      `/section/update-section-position/${boardId}`,
      newData,
    );
    return data.data;
  };
  static deleteSection = async (sectionId: string) => {
    const data = await $authHost.delete<Omit<ResponseType, 'data'>>(`/section/${sectionId}`);
    return data.data;
  };
}
