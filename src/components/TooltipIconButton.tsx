import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import React from 'react';
import { Button } from './ui/button';
interface TooltipIconButtonProps {
  tooltip: string;
  children: React.ReactNode;
  isPending: boolean;
  onClick: () => void;
  className?: string;
}
const TooltipIconButton: React.FC<TooltipIconButtonProps> = ({ tooltip, children, isPending, onClick, className }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={onClick} disabled={isPending} className={className}>
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
