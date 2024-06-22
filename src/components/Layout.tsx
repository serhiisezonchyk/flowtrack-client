import AvatarButton from '@/components/AvatarButton';
import { AuthContext } from '@/context/AuthContext';
import React, { useContext } from 'react';
import { Link, Outlet } from 'react-router-dom';

const Layout: React.FC = () => {
  const { isAuth } = useContext(AuthContext);
  return (
    <>
      <header className="h-16 bg-gray-300/10 backdrop-blur-lg	fixed top-0 w-full content-center">
        <div className="container">
          <nav className=" flex flex-row w-full gap-4 justify-between text-xl content-center">
            <div className="space-x-4 content-center">
              <Link to={'/'}>Logo</Link>
              {isAuth && (
                <>
                  <Link to={'/my-boards'}>Board</Link>
                </>
              )}
            </div>
            <div className="space-x-4 content-center">
              {!isAuth ? (
                <>
                  <Link to={'/sign-in'}>Sign in</Link>
                  <Link to={'/sign-up'}>Sign up</Link>
                </>
              ) : (
                <AvatarButton />
              )}
            </div>
          </nav>
        </div>
      </header>
      <main className="mt-16 h-[calc(100vh-4rem)]">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
