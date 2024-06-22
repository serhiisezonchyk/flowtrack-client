import { BoardType, SectionType } from './types';

export const boards: BoardType[] = [
  {
    id: 1,
    title: 'Personal',
    description: `Add description here
      🟢 You can add multiline description
      🟢 Let's start...`,
    isSaved: true,
    slug: 'personal',
    icon: '🏠', // Example: house icon
    // user: User
  },
  {
    id: 2,
    title: 'Work',
    description: 'Work-related tasks and projects',
    isSaved: true,
    slug: 'work',
    icon: '💼', // Example: briefcase icon
  },
  {
    id: 3,
    title: 'Travel Planning',
    description: 'Planning for upcoming trips',
    isSaved: false,
    slug: 'travel-planning',
    icon: '✈️', // Example: airplane icon
  },
  {
    id: 4,
    title: 'Shopping List',
    description: 'Items to buy during grocery shopping',
    isSaved: true,
    slug: 'shopping-list',
    icon: '🛒', // Example: shopping cart icon
  },
  {
    id: 5,
    title: 'Fitness Goals',
    description: 'Workout plans and fitness milestones',
    isSaved: false,
    slug: 'fitness-goals',
    icon: '🏋️‍♂️', // Example: weightlifting icon
  },
  {
    id: 6,
    title: 'Learning',
    description: 'Courses and books to complete',
    isSaved: true,
    slug: 'learning',
    icon: '📚', // Example: books icon
  },
  {
    id: 7,
    title: 'Home Improvement',
    description: 'Projects and repairs around the house',
    isSaved: true,
    slug: 'home-improvement',
    icon: '🔧', // Example: wrench icon
  },
  {
    id: 8,
    title: 'Event Planning',
    description: 'Planning events and gatherings',
    isSaved: false,
    slug: 'event-planning',
    icon: '🎉',
  },
];

export const sections: SectionType[] = [
  {
    id: 'Section1',
    title: 'Ideas',
    position: 0,
    tasks: [

      {
        id: 'Task2',
        title: 'Tes2',
        content: `dqewfwff
      fqwff
      wfqwfwqf`,
        position: 0,
        sectionId: 'Section1',
      },
      {
        id: 'Task1',
        title: 'Test',
        content: `dqwfwff
      fqwff
      wfqwfwqf`,
        position: 1,
        sectionId: 'Section1',
      },
    ],
  },
  {
    id: 'Section2',
    title: 'To do',
    position: 1,
    tasks: [
      {
        id: 'Task4',
        title: 'Test4',
        content: `dqwfwff
      fqwff
      wfqwfwqf`,
        position: 0,
        sectionId: 'Section2',
      },
    ],
  },
  {
    id: 'Section3',
    title: 'Done',
    position: 2,
    tasks: [
      {
        id: 'Task3',
        title: 'Test3',
        content: `dqwfwff
      fqwff3
      wfqwfwqf`,
        position: 0,
        sectionId: 'Section1',
      },
    ],
  },
  {
    id: 'Section4',
    title: 'Test1',
    position: 3,
    tasks: [],
  },
  {
    id: 'Section5',
    title: 'Test',
    position: 4,
    tasks: [],
  },
];