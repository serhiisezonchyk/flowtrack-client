import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout: React.FC = () => {
  return (
    <>
      <header className="h-16 bg-gray-300/20 fixed top-0 w-full content-center">
        <div className="container">
          <Navbar />
        </div>
      </header>
      <main className="mt-16 h-[calc(100vh-4rem)] overflow-y-auto">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
