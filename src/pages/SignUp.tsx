import SEO from '@/components/SEO';
import { Button, buttonVariants } from '@/components/ui/button';
import { AuthContext } from '@/context/AuthContext';
import AuthService from '@/services/auth.service';
import { ResponseError } from '@/types';
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
    const id = toast.loading('Please wait...');
    try {
      const data = await AuthService.signUp(props);
      if (data) {
        toast.update(id, { render: 'User created successfuly', type: 'success', isLoading: false, autoClose: 2000 });
        navigate('/sign-in');
      }
    } catch (error) {
      if (isAxiosError<ResponseError>(error)) {
        toast.update(id, { render: `${error.response?.data.error}`, type: 'error', isLoading: false, autoClose: 2000 });
      } else {
        toast.update(id, {
          render: 'Something went wrong! Try later.',
          type: 'error',
          isLoading: false,
          autoClose: 2000,
        });
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
      <SEO
        title="Sign Up | FlowTrack"
        description="Create a new account to get started with our amazing services."
        name="Sign Up"
        type="form"
      />
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
          <p className="text-sm text-muted-foreground">Enter your email below to create your account</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col px-2 sm:px-0">
          <Input
            {...register('login')}
            placeholder="Login"
            id="login"
            label="Login"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect="off"
            errorMessage={errors.login?.message}
          />
          <Input
            {...register('password')}
            placeholder="Password"
            id="password"
            type="password"
            label="Password"
            errorMessage={errors.password?.message}
          />
          <Input
            {...register('checkPassword')}
            placeholder="Repeat password"
            id="checkPassword"
            type="password"
            label="Repeat password"
            errorMessage={errors.password?.message}
          />
          <Button type="submit" className="mt-4" variant={'secondary'}>
            Sign Up
          </Button>
          <Link to={'/sign-in'} className={buttonVariants({ variant: 'link' })}>
            Already have an account?
          </Link>
          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking Sign Up, you agree to our{' '}
            <Link to="#" className="underline underline-offset-4 hover:text-primary">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to={'#'} className="underline underline-offset-4 hover:text-primary">
              Privacy Policy
            </Link>
            .
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
