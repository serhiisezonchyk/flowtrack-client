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
export const useSectionPositions = ({ onError }: { onError?: (error: any) => void }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['Change section positions'],
    mutationFn: async ({ boardId, newData }: { boardId: string; newData: SectionType[] }) =>
      SectionService.changeSectionPositions(boardId, newData),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ['section', variables.boardId] });
      const previousSection = queryClient.getQueryData(['section', variables.boardId]);
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

export const useDeleteSection = ({
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
    mutationKey: ['Delete section'],
    mutationFn: async (sectionId: string) => SectionService.deleteSection(sectionId),
    onMutate: async (sectionId) => {
      await queryClient.cancelQueries({ queryKey: ['section', boardId] });
      const previousSections = queryClient.getQueryData(['section', boardId]) as SectionType[];
      const updatedData = previousSections
        .filter((el) => el.id !== sectionId)
        .map((el, index) => ({ ...el, position: index }));
      queryClient.setQueryData(['section', boardId], updatedData);
      return { previousSections };
    },
    onError: (error, _, context: any) => {
      queryClient.setQueryData(['section', boardId], context.previousSections);
      onError?.(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['section', boardId] });
      onSuccess?.();
    },
  });
};
