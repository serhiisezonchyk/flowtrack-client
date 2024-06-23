import SectionService from '@/services/section.service';
import { SectionType } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useSections = (boardId: string) => {
  return useQuery({
    queryKey: ['section', boardId],
    queryFn: () => SectionService.getSections(boardId),
    enabled: !!boardId,
  });
};

export const useCreateSection = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['Create section'],
    mutationFn: async (boardId: string) => SectionService.createSection(boardId),
    onSuccess: (_, boardId) => {
      queryClient.invalidateQueries({ queryKey: ['section', boardId] });
      onSuccess?.();
    },
    onError: (error) => {
      onError?.(error);
    },
  });
};
export const useSectionPositions = ({
  onError,
}: {
  onError?: (error: any) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['Change section positions'],
    mutationFn: async ({ boardId, newData }: { boardId: string; newData: SectionType[] }) =>
      SectionService.changeSectionPositions(boardId, newData),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ['section', variables.boardId] });
      const previousBoard = queryClient.getQueryData(['section', variables.boardId]);
      queryClient.setQueryData(['section', variables.boardId], variables.newData);
      return { previousBoard };
    },
    onError: (error, variables, context: any) => {
      queryClient.setQueryData(['section', variables.boardId], context.previousBoard);
      onError?.(error);
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(['section', variables.boardId], data.data);
    },
  });
};
