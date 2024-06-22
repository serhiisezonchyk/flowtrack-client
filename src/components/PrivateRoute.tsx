import { AuthContext } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';
import React, { ReactNode, useContext } from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuth, isAuthInProgress } = useContext(AuthContext);

  if (isAuthInProgress) {
    return (
      <div className="h-[100%] w-full flex justify-center items-center">
        <Loader2 size={52} className="animate-spin" />
      </div>
    );
  }

  if (!isAuth) {
    return <Navigate to="/sign-in" replace />;
  } else return <>{children}</>;
};

export default PrivateRoute;
