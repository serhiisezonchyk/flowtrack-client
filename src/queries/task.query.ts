import TaskService from '@/services/task.service';
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
