import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from './ui/button';
interface TooltipIconButtonProps {
  tooltip: string;
  children: React.ReactNode;
  onClick: () => void;
  className?:string;
}
const TooltipIconButton: React.FC<TooltipIconButtonProps> = ({
  tooltip,
  children,
  onClick,
  className
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant='ghost' size='icon' onClick={onClick} className={className}>
            {children}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TooltipIconButton;
