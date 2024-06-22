import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './ui/breadcrumb';

const BoardLayout = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);
  return (
    <>
      <div className="container">
        <Breadcrumb className="hidden md:flex py-4 h-[52px]">
          <BreadcrumbList>
            {pathnames.map((el, index) =>
              pathnames.length !== index + 1 ? (
                <div className="flex flex-row items-center gap-1.5" key={el}>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link to="/my-boards">MY BOARDS</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                </div>
              ) : (
                <BreadcrumbItem key={el}>
                  <BreadcrumbPage>{el.replace(/-/g, ' ').toUpperCase()}</BreadcrumbPage>
                </BreadcrumbItem>
              ),
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="w-full h-[calc(100vh-4rem)] sm:h-[calc(100vh-4rem-52px)] overflow-y-auto">
        <Outlet />
      </div>
    </>
  );
};

export default BoardLayout;
