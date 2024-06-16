import { cn } from '@/lib/utils';
import { ComponentPropsWithoutRef, forwardRef, useId } from 'react';

interface InputProps extends ComponentPropsWithoutRef<'input'> {
  errorMessage?: string;
  label?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ errorMessage, label, className, ...rest }, ref) => {
    const id = useId();
    return (
      <div className='relative w-full'>
        {!!label && (
          <label htmlFor={id} className='sr-only'>
            {label}
          </label>
        )}
        <input
          {...rest}
          ref={ref}
          className={cn('rounded mb-5 p-2 w-full text-xl focus:outline-none', className)}
          id={id}
        />
        <span
          className={cn(
            'text-red-500 absolute -bottom-1 left-2  transition-all duration-300 ease-in-out text-sm ',
            !!errorMessage ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'
          )}
        >
          {errorMessage ? errorMessage : ''}
        </span>
      </div>
    );
  }
);

export default Input;
