import { errorHandler } from '@/lib/utils';
import TaskService from '@/services/task.service';
import { SectionType } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export const useCreateTask = ({ boardId }: { boardId: string }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['Create task'],
    mutationFn: async (sectionId: string) => TaskService.createTask(sectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['section', boardId] });
      toast.success('Task was added');
    },
    onError: (error) => {
      toast.error(errorHandler(error).error);
    },
  });
};
export const useDeleteTask = ({ boardId }: { boardId: string}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['Delete task'],
    mutationFn: async (taskId: string) => TaskService.deleteTask(taskId),
    onMutate: async (taskId) => {
      await queryClient.cancelQueries({ queryKey: ['section', boardId] });

      const previousSections = queryClient.getQueryData(['section', boardId]) as SectionType[];

      const newSections = previousSections?.map((section) => ({
        ...section,
        tasks: section.tasks.filter((task) => task.id !== taskId).map((task, index) => ({ ...task, position: index })),
      }));

      queryClient.setQueryData(['section', boardId], newSections);
      return { previousSections };
    },
    onError: (error, _, context) => {
      queryClient.setQueryData(['section', boardId], context?.previousSections);
      toast.error(errorHandler(error).error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['section', boardId] });
      toast.success('Task was deleted');
    },
  });
};

export const useTaskPositions = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['Change section positions'],
    mutationFn: async ({ boardId, newData }: { boardId: string; newData: SectionType[] }) =>
      TaskService.changeTaskPositions(boardId, newData),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ['section', variables.boardId] });
      const previousSection = queryClient.getQueryData(['section', variables.boardId]);
      queryClient.setQueryData(['section', variables.boardId], variables.newData);
      return { previousSection };
    },
    onError: (error, variables, context: any) => {
      queryClient.setQueryData(['section', variables.boardId], context.previousSection);
      toast.error(errorHandler(error).error);
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(['section', variables.boardId], data.data);
      // queryClient.invalidateQueries({ queryKey: ['section', variables.boardId] });
    },

    // onSettled: (data, _,variables) => {
    //   // queryClient.setQueryData(['section', variables.boardId], data.data);
    //   queryClient.invalidateQueries({ queryKey: ['section', variables.boardId] });
    // },
  });
};
