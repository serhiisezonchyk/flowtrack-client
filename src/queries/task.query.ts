import TaskService from '@/services/task.service';
import { SectionType } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCreateTask = ({ onSuccess, onError }: { onSuccess?: () => void; onError?: (error: any) => void }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['Create task'],
    mutationFn: async (sectionId: string) => TaskService.createTask(sectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['section'] });
      onSuccess?.();
    },
    onError: (error) => {
      onError?.(error);
    },
  });
};
export const useDeleteTask = ({
  boardId,
  onSuccess,
  onError,
}: {
  boardId: string;
  onSuccess?: () => void;
  onError?: (error: any) => void;
}) => {
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
      onError?.(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['section', boardId] });
      onSuccess?.();
    },
  });
};

export const useTaskPositions = ({ onError }: { onError?: (error: any) => void }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['Change section positions'],
    mutationFn: async ({ boardId, newData }: { boardId: string; newData: SectionType[] }) =>
      TaskService.changeTaskPositions(boardId, newData),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ['section', variables.boardId] });
      const previousSection =  queryClient.getQueryData(['section', variables.boardId]);
      queryClient.setQueryData(['section', variables.boardId], variables.newData);
      return { previousSection };
    },
    onError: (error, variables, context: any) => {
      queryClient.setQueryData(['section', variables.boardId], context.previousSection);
      onError?.(error);
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(['section', variables.boardId], data.data);
    },
  });
};
