import { lazy, useContext, useEffect } from 'react';
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BoardLayout from './components/BoardLayout';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import { AuthContext } from './context/AuthContext';
import Board from './pages/Board';
import GreetPage from './pages/GreetPage';
import SingleBoard from './pages/SingleBoard';
import SingleTaskPage from './pages/SingleTaskPage';

const SignIn = lazy(() => import('./pages/SignIn'));
const SignUp = lazy(() => import('./pages/SignUp'));
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
          path: 'sign-in',
          element: <SignIn />,
        },
        {
          path: 'sign-up',
          element: <SignUp />,
        },
        {
          path: 'my-boards',
          element: (
            <PrivateRoute>
              <BoardLayout />
            </PrivateRoute>
          ),
          children: [
            {
              index: true,
              element: <Board />,
            },
            {
              path: ':slug',
              children: [
                {
                  index: true,
                  element: <SingleBoard />,
                },
                {
                  path: ':taskId',
                  element: <SingleTaskPage />,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/" replace />,
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
