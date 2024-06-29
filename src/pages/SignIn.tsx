import { Button, buttonVariants } from '@/components/ui/button';
import { AuthContext } from '@/context/AuthContext';
import { ResponseError } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { CredentialResponse, GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { isAxiosError } from 'axios';
import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Input from '../components/Input';
import { SignInSchemaType, signInSchema } from '../validation/schemas';

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const { isAuth, login, googleSignIn } = useContext(AuthContext);
  const onSubmit = async (props: SignInSchemaType) => {
    const id = toast.loading('Please wait...');
    try {
      await login(props);
      toast.update(id, { render: 'Login succeed', type: 'success', isLoading: false, autoClose: 2000 });
      navigate('/my-boards');
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
  const handleGoogleSuccess = async (response: CredentialResponse) => {
    const id = toast.loading('Please wait...');
    try {
      await googleSignIn(response.credential!);
      toast.update(id, { render: 'Google Sign-In succeed', type: 'success', isLoading: false, autoClose: 2000 });
      navigate('/my-boards');
    } catch (error) {
      toast.update(id, { render: 'Google Sign-In failed', type: 'error', isLoading: false, autoClose: 2000 });
    }
  };

  const handleGoogleFailure = () => {
    toast.error('Google Sign-In failed');
  };

  const { register, handleSubmit, formState } = useForm<SignInSchemaType>({
    defaultValues: {
      login: '',
      password: '',
    },
    resolver: zodResolver(signInSchema),
  });
  const { errors } = formState;
  if (isAuth) return <Navigate to={'/'} replace={true} />;

  return (
    <div className="h-full flex justify-center items-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Login</h1>
          <p className="text-sm text-muted-foreground">Enter your email and password below to login your account</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col px-2 sm:px-0">
          <Input
            {...register('login')}
            placeholder="Login"
            label="Login"
            id="login"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect="off"
            errorMessage={errors.login?.message}
          />
          <Input
            {...register('password')}
            placeholder="Password"
            type="password"
            id="password"
            autoCorrect="off"
            label="Password"
            errorMessage={errors.password?.message}
          />
          <div className="w-full flex flex-row mt-6 gap-2">
            <Button type="submit" className="flex-1" variant={'secondary'}>
              Sign In
            </Button>
            <GoogleOAuthProvider clientId={import.meta.env.VITE_APP_CLIENT_ID}>
              <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleFailure} type='icon'/>
            </GoogleOAuthProvider>
          </div>
        </form>
        <div className="text-center flex flex-col gap-2">
          <div className="flex items-center justify-center">
            <div className="border-t border-gray-300 flex-grow mr-3"></div>
            <div>Or</div>
            <div className="border-t border-gray-300 flex-grow ml-3"></div>
          </div>
          <Link to={'/sign-up'} className={buttonVariants({ variant: 'outline' })}>
            Create new account...
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
