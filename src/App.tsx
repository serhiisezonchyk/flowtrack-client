import { useContext, useEffect } from 'react';
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BoardLayout from './components/BoardLayout';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import { AuthContext } from './context/AuthContext';
import Board from './pages/Board';
import GreetPage from './pages/GreetPage';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import SingleBoard from './pages/SingleBoard';

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
          element: <BoardLayout />,
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
      <ToastContainer position="bottom-right" theme="light" autoClose={3000} />
    </>
  );
}

export default App;
