import BoardService from '@/services/board.service';
import { CreateBoardSchemaType } from '@/validation/schemas';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useBoards = () => {
  return useQuery({
    queryKey: ['boards'],
    queryFn: BoardService.getBoards,
    initialData: [],
  });
};

export const useBoard = (slug: string) => {
  return useQuery({
    queryKey: ['board', slug],
    queryFn: () => BoardService.getBoard(slug as string),
    enabled: !!slug,
  });
};

export const useChangeBoardSaved = ({
  slug,
  onError,
  onSuccess,
}: {
  slug: string;
  onSuccess?: () => void;
  onError?: (error: any) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['Change isSaved'],
    mutationFn: async (id: string) => BoardService.changeIsSaved(id),
    //Optimistic update of data
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['board', slug] });
      const previousBoard = queryClient.getQueryData(['board', slug]);
      queryClient.setQueryData(['board', slug], (old: any) => ({
        ...old,
        isSaved: !old.isSaved,
      }));
      return { previousBoard };
    },
    onError: (error, _, context: any) => {
      //Set previous data on error
      queryClient.setQueryData(['board', slug], context.previousBoard);
      onError?.(error);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['board', slug], data.data);
      onSuccess?.();
    },
  });
};

export const useCreateBoard = ({ onSuccess, onError }: { onSuccess?: () => void; onError?: (error: any) => void }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['Create board'],
    mutationFn: async (values: CreateBoardSchemaType) => BoardService.createBoard(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
      onSuccess?.();
    },
    onError: (error) => {
      onError?.(error);
    },
  });
};
