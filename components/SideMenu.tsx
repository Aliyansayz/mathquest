import React, { useState } from 'react';
import { COURSES } from '../constants';
import type { Topic } from '../types';

interface SideMenuProps {
  activeTopic: Topic | null;
  onSelectTopic: (topic: Topic) => void;
}

const ChartBarIcon = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);

const ChevronDownIcon = ({ className = 'w-5 h-5' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
);


export const SideMenu: React.FC<SideMenuProps> = ({ activeTopic, onSelectTopic }) => {
  const [openCourses, setOpenCourses] = useState<string[]>([COURSES[0].name]); // Open first course by default

  const toggleCourse = (courseName: string) => {
    setOpenCourses(prev =>
      prev.includes(courseName)
        ? prev.filter(name => name !== courseName)
        : [...prev, courseName]
    );
  };

  return (
    <aside className="w-80 bg-white p-4 flex flex-col shadow-lg shrink-0 border-r border-gray-200">
      <div className="flex items-center gap-3 mb-6 px-2">
        <div className="p-2 bg-indigo-600 rounded-lg">
           <ChartBarIcon className="w-8 h-8 text-white"/>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">MathQuest</h1>
      </div>
      <nav className="flex-1 flex flex-col space-y-2 overflow-y-auto pr-2">
        {COURSES.map((course) => {
          const isOpen = openCourses.includes(course.name);
          return (
            <div key={course.name}>
              <button
                onClick={() => toggleCourse(course.name)}
                className="w-full flex justify-between items-center px-3 py-2 text-sm font-semibold text-gray-500 uppercase tracking-wider hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span>{course.name}</span>
                <ChevronDownIcon className={`w-5 h-5 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              {isOpen && course.subtopics && (
                <div className="space-y-1 mt-2 pl-4 border-l-2 border-gray-200">
                  {course.subtopics.map((topic) => {
                    const isActive = topic.name === activeTopic;
                    return (
                      <button
                        key={topic.name}
                        onClick={() => onSelectTopic(topic.name)}
                        className={`w-full px-3 py-2.5 rounded-lg text-left font-medium transition-all duration-200 flex items-center gap-3 ${
                          isActive
                            ? 'bg-indigo-50 text-indigo-700'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-indigo-500' : 'bg-gray-400'}`}></span>
                        {topic.name}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>
      <div className="mt-auto pt-4 text-xs text-gray-400 px-2">
        <p>&copy; 2024 Interactive Learning</p>
      </div>
    </aside>
  );
};