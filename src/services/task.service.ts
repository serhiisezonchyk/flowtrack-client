import { $authHost } from '@/services';
import { ResponseType, SectionType, TaskType } from '@/types';

export default class TaskService {
  static createTask = async (sectionId: string) => {
    const { data } = await $authHost.post<Omit<ResponseType<TaskType>, 'message'>>(`/task/${sectionId}`);
    return data.data;
  };
  static deleteTask = async (taskId: String) => {
    const { data } = await $authHost.delete<Omit<ResponseType, 'data'>>(`/task/${taskId}`);
    return data.message;
  };

  static changeTaskPositions = async (boardId: string, newData: SectionType[]) => {
    const data = await $authHost.put<Omit<ResponseType<SectionType[]>, 'message'>>(
      `/section/update-task-position/${boardId}`,
      newData,
    );
    return data.data;
  };
}
