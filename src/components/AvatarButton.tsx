import React, { useContext } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { User } from 'lucide-react';
import { Button } from './ui/button';
import { isAxiosError } from 'axios';
import { ResponseError } from '@/data/errorTypes';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import inMemoryJWT from '@/lib/inMemoryJWT';
import { AuthContext } from '@/context/AuthContext';

const AvatarButton: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logout success');
      navigate('/sign-in');
    } catch (error) {
      if (isAxiosError<ResponseError>(error)) {
        toast.error(error.response?.data.error);
      } else {
        toast.error('Something went wrong! Try later.');
      }
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='icon' className='rounded-full'>
          <User size={24} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem onClick={() => console.log('ss')}>
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AvatarButton;
