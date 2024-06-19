import EmojiPicker from '@/components/EmojiPicker';
import Input from '@/components/Input';
import Kanban from '@/components/Kanban';
import TooltipIconButton from '@/components/TooltipIconButton';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AuthContext } from '@/context/AuthContext';
import { boards } from '@/mock';
import { Star, Trash2 } from 'lucide-react';
import React, { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';

const SingleBoard = () => {
  const { isAuth } = useContext(AuthContext);
  const { slug } = useParams();
  const data = boards.find((el) => el.slug === slug);
  const [icon, setIcon] = useState<string>(data?.icon as string);
  const [title, setTitle] = useState<string>(data?.title as string);
  const [description, setDescription] = useState<string>(
    data?.description as string
  );

  const onIconChange = (newIcon: string) => {
    setIcon(newIcon);
  };
  return (
    <div>
      {/* Main info */}
      <div className='py-4'>
        <div className='container'>
          <div className='space-y-4'>
            {/* Actions/emojis */}
            <div className='w-full flex flex-row justify-between items-center'>
              <EmojiPicker icon={icon} onChange={onIconChange} />
              <div className='flex flex-row gap-8'>
                <TooltipIconButton
                  tooltip='Add to favourite'
                  onClick={() => {}}
                >
                  <Star stroke='gray' size={24} cursor='pointer' />
                </TooltipIconButton>
                <TooltipIconButton tooltip='Remove board' onClick={() => {}}>
                  <Trash2 stroke='red' size={24} cursor='pointer' />
                </TooltipIconButton>
              </div>
            </div>

            {/* Title */}
            <Input
              value={title}
              className='border-none mb-0 text-2xl px-0'
              onChange={(e) => setTitle(e.target.value)}
            />

            {/* Description */}
            <Textarea
              className='border-none resize-none px-0'
              defaultValue={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            />
          </div>
        </div>
        <Kanban />
      </div>
    </div>
  );
};

export default SingleBoard;
