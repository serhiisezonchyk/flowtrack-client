import { errorHandler } from '@/lib/utils';
import BoardService from '@/services/board.service';
import { CreateBoardSchemaType, UpdateBoardSchemaType } from '@/validation/schemas';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

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

export const useChangeBoardSaved = ({ slug }: { slug: string }) => {
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
    onError: (_, __, context: any) => {
      //Set previous data on error
      queryClient.setQueryData(['board', slug], context.previousBoard);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['board', slug], data.data);
    },
  });
};

export const useCreateBoard = ({ onSuccess, onError }: { onSuccess?: () => void; onError?: () => void }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['Create board'],
    mutationFn: async (values: CreateBoardSchemaType) => BoardService.createBoard(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['board'] });
      toast.success('New board was added');
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(errorHandler(error).error);
      onError?.();
    },
  });
};

export const useUpdateBoard = (slug: string) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationKey: ['Update board'],
    mutationFn: async ({ boardId, newData }: { boardId: string; newData: UpdateBoardSchemaType }) =>
      BoardService.updateBoard(boardId, newData),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ['board', slug] });
      const previousBoard = queryClient.getQueryData(['board', slug]);
      queryClient.setQueryData(['board', slug], (old: any) => ({
        ...old,
        ...variables.newData,
      }));
      return { previousBoard };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['board', data?.slug] });
      if (data?.slug && data.slug !== slug) {
        navigate(`/my-boards/${data.slug}`);
      }
    },
    onError: (error, __, context) => {
      queryClient.setQueryData(['board', slug], context?.previousBoard);
      const err = errorHandler(error);
      toast.error(`${err.error}\n${err.details}`);
    },
  });
};
