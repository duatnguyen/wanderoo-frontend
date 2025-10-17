import React from 'react';

const TailwindTest: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center p-8">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          TailwindCSS Test
        </h1>
        
        <div className="space-y-4">
          <div className="bg-blue-500 text-white p-4 rounded-lg">
            <p className="font-medium">Blue Background</p>
          </div>
          
          <div className="bg-green-500 text-white p-4 rounded-lg">
            <p className="font-medium">Green Background</p>
          </div>
          
          <div className="bg-red-500 text-white p-4 rounded-lg">
            <p className="font-medium">Red Background</p>
          </div>
          
          <button className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200">
            Hover Me!
          </button>
          
          <div className="flex space-x-2">
            <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
            <div className="w-4 h-4 bg-pink-400 rounded-full"></div>
            <div className="w-4 h-4 bg-indigo-400 rounded-full"></div>
            <div className="w-4 h-4 bg-teal-400 rounded-full"></div>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mt-6 text-center">
          If you see styled components above, TailwindCSS is working! 🎉
        </p>
      </div>
    </div>
  );
};

export default TailwindTest;