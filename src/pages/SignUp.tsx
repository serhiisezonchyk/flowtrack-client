import { AuthContext } from '@/context/AuthContext';
import { ResponseError } from '@/data/errorTypes';
import AuthService from '@/services/auth.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';
import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Input from '../components/Input';
import { SignUpSchemaType, signUpSchema } from '../validation/schemas';

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const { isAuth } = useContext(AuthContext);

  const onSubmit = async (props: SignUpSchemaType) => {
    try {
      const data = await AuthService.signUp(props);
      if (data) {
        toast.success('User created successfuly');
        navigate('/sign-in');
      }
    } catch (error) {
      if (isAxiosError<ResponseError>(error)) {
        toast.error(error.response?.data.error);
      } else {
        toast.error('Something went wrong! Try later.');
      }
    }
  };

  const { register, handleSubmit, formState, control } = useForm<SignUpSchemaType>({
    defaultValues: {
      login: '',
      password: '',
    },
    resolver: zodResolver(signUpSchema),
  });
  const { errors } = formState;

  if (isAuth) return <Navigate to={'/'} replace={true} />;
  return (
    <div className="h-full flex justify-center items-center">
      <div className="w-full sm:w-[80%] md:w-[320px] space-y-2 text-right">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col px-2">
          <Input
            {...register('login')}
            placeholder="Login"
            className="border-2 border-transparent border-b-2 border-b-purple-100 focus:border-b-purple-300"
            label="Login"
            errorMessage={errors.login?.message}
          />
          <Input
            {...register('password')}
            placeholder="Password"
            type="password"
            className="border-2 border-transparent border-b-2 border-b-purple-100 focus:border-b-purple-300"
            label="Password"
            errorMessage={errors.password?.message}
          />
          <Input
            {...register('checkPassword')}
            placeholder="Repeat password"
            type="password"
            className="border-2 border-transparent border-b-2 border-b-purple-100 focus:border-b-purple-300"
            label="Repeat password"
            errorMessage={errors.password?.message}
          />
          <button
            className="mt-8 py-4 px-6 rounded-sm bg-slate-500/10 duration-300 transition-all ease-out  hover:bg-slate-500/15 active:bg-slate-500/15"
            type="submit"
          >
            Sign Up
          </button>
        </form>
        <div className="mr-2">
          <Link to={'/sign-in'} className="text-blue-500 underline hover:text-blue-600 active:bg-slate-500/15">
            Already have an account?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
