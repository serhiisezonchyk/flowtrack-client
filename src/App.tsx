import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import GreetPage from './pages/GreetPage';
import Layout from './components/Layout';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Board from './pages/Board';
import PrivateRoute from './components/PrivateRoute';
import { useContext, useEffect } from 'react';
import { AuthContext } from './context/AuthContext';
import SingleBoard from './pages/SingleBoard';
import BoardLayout from './components/BoardLayout';

function App() {
  const { checkAuth } = useContext(AuthContext);
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          index: true,
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
          path: '/my-boards',
          element:<BoardLayout/>,
          children: [
            {
              index: true,
              element: (
                <PrivateRoute>
                  <Board />
                </PrivateRoute>
              ),
            },
            {
              path: '/my-boards/:slug',
              element: (
                <PrivateRoute>
                  <SingleBoard />
                </PrivateRoute>
              ),
            },
          ],
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
