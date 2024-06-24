import { useMemo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './ui/breadcrumb';
const BREADCRUMB_LABELS = {
  1: 'MY BOARDS',
  3: 'TASK',
  DEFAULT: 'UNKNOWN',
};

const generateBreadcrumbLabel = (el: string, index: number): string => {
  if (index === 1 || index === 3) {
    return BREADCRUMB_LABELS[index];
  }
  if (index === 2) {
    return el.replace(/-/g, ' ').toUpperCase();
  }
  return BREADCRUMB_LABELS.DEFAULT;
};
const generatePath = (pathnames: string[], index: number) => {
  return '/' + pathnames.slice(0, index + 1).join('/');
};
const CustomBreadcrumbItem = ({ el, index, pathnames }: { el: string; index: number; pathnames: string[] }) => {
  const label = generateBreadcrumbLabel(el, index);
  const path = generatePath(pathnames, index - 1);
  return (
    <>
      <BreadcrumbItem>
        {index === pathnames.length ? (
          <BreadcrumbPage>{label}</BreadcrumbPage>
        ) : (
          <BreadcrumbLink href={path}>{label}</BreadcrumbLink>
        )}
      </BreadcrumbItem>
      {index < pathnames.length && <BreadcrumbSeparator />}
    </>
  );
};

const BoardLayout: React.FC = () => {
  const location = useLocation();
  const pathnames = useMemo(() => location.pathname.split('/').filter((x) => x), [location.pathname]);

  return (
    <>
      <div className="container overflow-hidden">
        <Breadcrumb className="hidden md:flex py-4 h-[52px]">
          <BreadcrumbList>
            {pathnames.map((el, index) => (
              <CustomBreadcrumbItem key={el} pathnames={pathnames} index={index + 1} el={el} />
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="w-full h-[calc(100vh-4rem)] sm:h-[calc(100vh-4rem-52px)] overflow-x-hidden">
        <Outlet />
      </div>
    </>
  );
};

export default BoardLayout;
