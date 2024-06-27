import BoardLogo from './assets/logo.svg'
const Logo = () => {
  return (
    <svg className='size-8 fill-white -rotate-90 stroke-foreground'><use href={`${BoardLogo}#logo`}/></svg>
  );
};

export default Logo;
