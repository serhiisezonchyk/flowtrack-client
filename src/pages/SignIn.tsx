import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { SignInSchemaType, signInSchema } from '../validation/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '../components/Input';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { ResponseError } from '@/data/errorTypes';
import { isAxiosError } from 'axios';
import { AuthContext } from '@/context/AuthContext';
import { toast } from 'react-toastify';

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const { isAuth, login } = useContext(AuthContext);
  const onSubmit = async (props: SignInSchemaType) => {
    try {
      await login(props);
      toast.success('Login succeed');
      navigate('/my-boards');
    } catch (error) {
      if (isAxiosError<ResponseError>(error)) {
        toast.error(error.response?.data.error);
      } else {
        toast.error('Something went wrong! Try later.');
      }
    }
  };

  const { register, handleSubmit, formState, control } =
    useForm<SignInSchemaType>({
      defaultValues: {
        login: '',
        password: '',
      },
      resolver: zodResolver(signInSchema),
    });
  const { errors } = formState;
  if (isAuth) return <Navigate to={'/'} replace={true} />;

  return (
    <div className='h-full flex justify-center items-center'>
      <div className='w-full sm:w-[80%] md:w-[320px] space-y-2'>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='flex flex-col px-2 sm:px-0'
        >
          <Input
            {...register('login')}
            placeholder='Login'
            className='border-2 border-transparent border-b-2 border-b-purple-100 focus:border-b-purple-300'
            label='Login'
            errorMessage={errors.login?.message}
          />
          <Input
            {...register('password')}
            placeholder='Password'
            type='password'
            className='border-2 border-transparent border-b-2 border-b-purple-100 focus:border-b-purple-300'
            label='Password'
            errorMessage={errors.password?.message}
          />
          <button
            className='mt-8 py-4 px-6 rounded-sm bg-slate-500/10 duration-300 transition-all ease-out hover:bg-slate-500/15'
            type='submit'
          >
            Sign In
          </button>
        </form>
        <div className='text-center flex flex-col gap-2'>
          <div className='flex items-center justify-center'>
            <div className='border-t border-gray-300 flex-grow mr-3'></div>
            <div>or</div>
            <div className='border-t border-gray-300 flex-grow ml-3'></div>
          </div>
          <Link
            to={'/sign-up'}
            className='py-4 px-6 rounded-sm bg-purple-500/10 duration-300 transition-all ease-out hover:bg-purple-500/15'
          >
            Create new account...
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
