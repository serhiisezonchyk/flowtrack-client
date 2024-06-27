import { AuthContext } from '@/context/AuthContext';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

const GreetPage: React.FC = () => {
  const { isAuth } = useContext(AuthContext);

  return (
    <div className="overflow-y-scroll">
      <section className="bg-blue-100 py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-blue-800">Welcome to FlowTrack</h1>
          <p className="mt-4 text-lg text-blue-700">Your ultimate Kanban application for seamless task management.</p>
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-semibold text-gray-800">Get Started</h2>
          <p className="mt-4 text-gray-600">Create boards, add tasks, and track your progress with ease.</p>
          <Link
            className="mt-8 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
            to={isAuth ? '/my-boards' : '/sign-in'}
          >
            {isAuth ? 'My boards' : 'Start Now'}
          </Link>
        </div>
      </section>

      <section className="bg-gray-100 py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-semibold text-gray-800">Features</h2>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-blue-800">Easy to Use</h3>
              <p className="mt-2 text-gray-600">Intuitive interface that lets you manage tasks effortlessly.</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-blue-800">Collaborative</h3>
              <p className="mt-2 text-gray-600">Work with your team in real-time and stay synchronized.</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-blue-800">Customizable</h3>
              <p className="mt-2 text-gray-600">Tailor the boards to fit your workflow and preferences.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GreetPage;
