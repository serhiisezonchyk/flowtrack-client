import React, { useState } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Button } from './ui/button';
import { PlusSquare } from 'lucide-react';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateBoardSchemaType, createBoardSchema } from '@/validation/schemas';
import { cn, errorHandler } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import BoardService from '@/services/board.service';

interface AddBoardDialogProps {}
const AddBoardDialog: React.FC<AddBoardDialogProps> = () => {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useMutation({
    mutationKey: ['Create board'],
    mutationFn: async (values: CreateBoardSchemaType) =>
      BoardService.createBoard(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
      toast.success('New board was added')
      setOpen(false);
    },
    onError: (e) => {
      const error = errorHandler(e);
      toast.error(error.error);
      reset();
    },
  });
  const onSubmit = async (values: CreateBoardSchemaType) => {
    mutate(values);
  };
  const { register, handleSubmit, formState, reset } =
    useForm<CreateBoardSchemaType>({
      defaultValues: {
        title: '',
      },
      resolver: zodResolver(createBoardSchema),
    });
  const { errors } = formState;
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' className='p-2'>
          <PlusSquare size={24} fill='white' />
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Add board</DialogTitle>
          <DialogDescription>
            Make shure your board name creates unique slug.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-2'>
          <div className='relative w-full flex flex-col gap-2 '>
            <label htmlFor='title' className='text-muted-foreground'>
              Title
            </label>
            <input
              {...register('title')}
              className='mb-6 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background   file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring  disabled:cursor-not-allowed disabled:opacity-50'
              id='title'
            />
            <span
              className={cn(
                'text-red-500 absolute -bottom-[2px] left-2  transition-all duration-300 ease-in-out text-sm ',
                !!errors.title?.message
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 -translate-y-1'
              )}
            >
              {errors.title?.message ? errors.title?.message : ''}
            </span>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type='button' variant='secondary' disabled={isPending}>
                Close
              </Button>
            </DialogClose>
            <Button type='submit' disabled={isPending}>Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddBoardDialog;
