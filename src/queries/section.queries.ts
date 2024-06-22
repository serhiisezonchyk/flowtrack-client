import SectionService from '@/services/section.service';
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['section'] });
      onSuccess?.();
    },
    onError: (error) => {
      onError?.(error);
    },
  });
};
