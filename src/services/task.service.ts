import { TaskType } from '@/types';
import { $authHost } from '.';

interface CreateTaskRespone {
  data: TaskType;
}
export default class TaskService {
  static createTask = async (sectionId: string) => {
    const { data } = await $authHost.post<CreateTaskRespone>(`/task/${sectionId}`);
    return data.data;
  };
}
