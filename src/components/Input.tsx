import { Input as SHInput } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { ComponentPropsWithoutRef, forwardRef } from 'react';
import { Label } from './ui/label';
interface InputProps extends ComponentPropsWithoutRef<'input'> {
  errorMessage?: string;
  label?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ errorMessage, label, className,id, ...rest }, ref) => {
  return (
    <div className="relative w-full flex flex-col">
      {!!label && <Label htmlFor={id} className='mb-2'>{label}</Label>}
      <SHInput
        {...rest}
        id={id}
        ref={ref}
        className={cn('mb-7 p-2 w-full text-lg focus-visible:ring-offset-0', className)}
      />
      <span
        className={cn(
          'text-red-500 absolute bottom-1 left-2  transition-all duration-300 ease-in-out text-sm ',
          !!errorMessage ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1',
        )}
      >
        {errorMessage ? errorMessage : ''}
      </span>
    </div>
  );
});

export default Input;
