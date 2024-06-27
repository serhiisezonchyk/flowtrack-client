import Logo from '@/Logo';
import { AuthContext } from '@/context/AuthContext';
import { LogIn } from 'lucide-react';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import AvatarButton from './AvatarButton';
import { ModeToggleButton } from './ModeToggle';

const Navbar = () => {
  const { isAuth } = useContext(AuthContext);

  return (
    <nav className="flex flex-row w-full gap-4 justify-between text-xl content-center">
      <div className="space-x-4 content-center">
        <Link to="/">
          <div className="flex gap-2 items-center">
            {/* <div className='size-7'> */}
              <Logo />
            {/* </div> */}
            <span className="font-playwrite text-sm sm:text-md">FlowTrack</span>
          </div>
        </Link>
      </div>
      <div className="space-x-4 content-center">
        {!isAuth ? (
          <div className="gap-2 content-center flex items-center">
            <ModeToggleButton />
            <Link
              to="/sign-in"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10"
            >
              <LogIn className="w-[1.2rem] h-[1.2rem]" />
              <span className="sr-only">Login</span>
            </Link>
          </div>
        ) : (
          <AvatarButton />
        )}
      </div>
    </nav>
  );
};

export default Navbar;
