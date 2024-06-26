import { errorHandler } from '@/lib/utils';
import SectionService from '@/services/section.service';
import { SectionType } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { UpdateSectionSchemaType } from './../validation/schemas';

export const useSections = (boardId: string) => {
  return useQuery({
    queryKey: ['section', boardId],
    queryFn: () => SectionService.getSections(boardId),
    enabled: !!boardId,
  });
};

export const useCreateSection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['Create section'],
    mutationFn: async (boardId: string) => SectionService.createSection(boardId),
    onSuccess: (_, boardId) => {
      queryClient.invalidateQueries({ queryKey: ['section', boardId] });
      toast.success('New section was added');
    },
    onError: (error) => {
      toast.error(errorHandler(error).error);
    },
  });
};
export const useSectionPositions = () => {
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
      toast.error(errorHandler(error).error);
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

export const useChangeSectionTitle = ({ boardId }: { boardId: string }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['Change section title'],
    mutationFn: ({ sectionId, newData }: { sectionId: string; newData: UpdateSectionSchemaType }) =>
      SectionService.updateTitle(sectionId, newData),
    //Optimistic update of data
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ['section', boardId] });

      const previousSections = queryClient.getQueryData(['section', boardId]) as SectionType[];
      const sectionsToUpdate = [...previousSections].map((el) =>
        el.id === variables.sectionId ? { ...el, ...variables.newData } : el,
      );
      queryClient.setQueryData(['section', boardId], sectionsToUpdate);
      return { previousSections };
    },
    onError: (error, _, context: any) => {
      queryClient.setQueryData(['section', boardId], context.previousSections);
      toast.error(errorHandler(error).error);
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(['section', boardId], (old: SectionType[]) => {
        const newState = old.map((el) => (el.id === variables.sectionId ? { ...el, title: data.data?.title } : el));
        return newState;
      });
      // queryClient.invalidateQueries({ queryKey: ['section', boardId] });
    },
  });
};
