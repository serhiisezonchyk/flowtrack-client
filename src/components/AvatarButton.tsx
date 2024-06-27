import { AuthContext } from '@/context/AuthContext';
import { ResponseError } from '@/types';
import { isAxiosError } from 'axios';
import { User } from 'lucide-react';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ModeToggle } from './ModeToggle';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

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
        <Button variant="outline" size="icon" className="rounded-full">
          <User size={24} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <ModeToggle />
        <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AvatarButton;
