import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import GreetPage from './pages/GreetPage';
import Layout from './pages/Layout';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Board from './pages/Board';
import PrivateRoute from './components/PrivateRoute';
import { useContext, useEffect } from 'react';
import { AuthContext } from './context/AuthContext';

function App() {
  const { checkAuth } = useContext(AuthContext);
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          path: '/',
          element: <GreetPage />,
        },
        {
          path: '/sign-in',
          element: <SignIn />,
        },
        {
          path: '/sign-up',
          element: <SignUp />,
        },
        {
          path: '/board',
          element: (
            <PrivateRoute>
              <Board />
            </PrivateRoute>
          ),
        },
      ],
    },

    {
      path: '*',
      element: <Navigate to={'/'} replace={true} />,
    },
  ]);
  useEffect(() => {
    const fetchCheck = async () => {
      await checkAuth();
    };
    fetchCheck();
  }, []);
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer position='bottom-right' theme='light' autoClose={3000} />
    </>
  );
}

export default App;
