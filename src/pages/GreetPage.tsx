import { AuthContext } from '@/context/AuthContext';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
const GreetPage: React.FC = () => {
  const { isAuth } = useContext(AuthContext);

  useGSAP(() => {
    const timeline = gsap.timeline();
    timeline
      .fromTo(
        '#header',
        {
          opacity: 0,
          x: -20,
          duration: 150,
        },
        { opacity: 1, x: 0 },
      )
      .to('#headerLogo', {
        opacity: 1,
      })
      .fromTo(
        '#headerDesc',
        {
          opacity: 0,
          x: -20,
          duration: 150,
        },
        { opacity: 1, x: 0 },
      );
  }, []);

  return (
    <>
      <section className="bg-accent py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 id="header" className="text-4xl font-bold text-primary">
            Welcome to{' '}
            <span id="headerLogo" className="text-black dark:text-white font-playwrite opacity-0">
              FlowTrack
            </span>
          </h1>
          <p id="headerDesc" className="mt-4 text-lg text-muted-foreground">
            Your ultimate Kanban application for seamless task management.
          </p>
        </div>
      </section>

      <section className="bg-background py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex flex-col">
            <h2 className="text-3xl font-semibold text-muted-foreground">Get Started</h2>
            <p className="mt-4 text-muted-foreground/80">
              Create boards, add tasks, and track your progress with ease.
            </p>
            <img
              src="./draggable.png"
              className="block dark:hidden sm:w-[400px] md:w-[600px] shadow-md sm:h-auto self-center mt-4 border-border border-2 rounded-md"
              loading="lazy"
              alt="Board preview"
            ></img>
            <img
              src="./draggableDark.png"
              className="hidden dark:block sm:w-[400px] md:w-[600px] shadow-md sm:h-auto self-center mt-4 border-border border-2 rounded-md"
              loading="lazy"
              alt="Board preview"
            ></img>
            <Link
              className="mt-8 px-6 py-2 bg-primary transition-colors ease-out text-primary-foreground rounded-full hover:bg-primary/90 w-44 self-center"
              to={isAuth ? '/my-boards' : '/sign-in'}
            >
              {isAuth ? 'My boards' : 'Start Now'}
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-accent py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-semibold text-muted-foreground">Features</h2>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-card rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-primary">Easy to Use</h3>
              <p className="mt-2 text-card-foreground">Intuitive interface that lets you manage tasks effortlessly.</p>
            </div>
            <div className="p-6 bg-card rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-primary">Collaborative</h3>
              <p className="mt-2 text-card-foreground">Work with your team in real-time and stay synchronized.</p>
            </div>
            <div className="p-6 bg-card rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-primary">Customizable</h3>
              <p className="mt-2 text-card-foreground">Tailor the boards to fit your workflow and preferences.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex flex-col">
            <h2 className="text-3xl font-semibold text-muted-foreground">Dark Mode</h2>
            <p className="mt-4 text-muted-foreground/80">
              FlowTrack supports dark mode for a comfortable viewing experience in low-light environments.
            </p>
            <img
              src="./darkMode.png"
              className="block sm:w-[400px] md:w-[600px] shadow-md sm:h-auto self-center mt-4 border-border border-2 rounded-md"
              loading="lazy"
              alt="Dark mode preview"
            />
          </div>
        </div>
      </section>

      <section className="bg-accent py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex flex-col">
            <h2 className="text-3xl font-semibold text-muted-foreground">Task Example</h2>
            <p className="mt-4 text-muted-foreground">
              You can write task descriptions with tables, lists, and more using Markdown.
            </p>
            <img
              src="./task.png"
              className="block dark:hidden sm:w-[400px] md:w-[600px] shadow-md sm:h-auto self-center mt-4 border-border border-2 rounded-md"
              loading="lazy"
              alt="Board preview"
            ></img>
            <img
              src="./taskDark.png"
              className="hidden dark:block sm:w-[400px] md:w-[600px] shadow-md sm:h-auto self-center mt-4 border-border border-2 rounded-md"
              loading="lazy"
              alt="Board preview"
            ></img>
          </div>
        </div>
      </section>
    </>
  );
};

export default GreetPage;
