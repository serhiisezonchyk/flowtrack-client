import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import React, { useState } from 'react';

import { UpdateBoardSchemaType } from '@/validation/schemas';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Skeleton } from '../ui/skeleton';

interface EmojiPickerProps {
  icon: string;
  onChange: (data: string) => void;
  isBoardLoading: boolean;
}
const EmojiPicker: React.FC<EmojiPickerProps> = ({ icon, onChange, isBoardLoading }) => {
  const [selectedEmoji, setSelectedEmoji] = useState<string>(icon);

  const selectEmoji = (e: any) => {
    setSelectedEmoji(e.native);
  };
  if (isBoardLoading) return <Skeleton className="size-9 rounded-full" />;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <span className="text-3xl cursor-pointer">{icon}</span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select new emoji {selectedEmoji}</DialogTitle>
          <DialogDescription>Select emoji which describes your board</DialogDescription>
        </DialogHeader>
        <div className="flex flex-row justify-center z-50">
          <Picker data={data} onEmojiSelect={selectEmoji} previewPosition={'none'} theme="light" perLine={8} />
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button" variant="default" onClick={() => onChange(selectedEmoji)}>
              Save
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EmojiPicker;
