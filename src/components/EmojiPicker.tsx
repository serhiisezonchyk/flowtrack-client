import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import React, { useState } from 'react';

import { Button } from './ui/button';
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

interface EmojiPickerProps {
  icon: string;
  onChange: (icon: string) => void;
}
const EmojiPicker: React.FC<EmojiPickerProps> = ({ icon, onChange }) => {
  const [selectedEmoji, setSelectedEmoji] = useState<string>(icon);

  const selectEmoji = (e: any) => {
    setSelectedEmoji(e.native);
  };

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
