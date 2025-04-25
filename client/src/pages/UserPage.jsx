import { useState } from 'react';
import { User, Book, FileQuestion, FileCheck, LogOut, Menu, X } from 'lucide-react';
import React from 'react';

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('profile');
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const menuItems = [
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'notes', icon: Book, label: 'My Notes' },
    { id: 'pyqs', icon: FileQuestion, label: 'PYQs' },
    { id: 'solutions', icon: FileCheck, label: 'Solutions' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Fixed width sidebar */}
      <div className={`fixed inset-y-0 left-0 w-64 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out z-30`}>
        <div className="flex flex-col h-full bg-gray-900 text-white p-4">
          <div className="flex items-center justify-between mb-8 px-4 pt-4">
            <h1 className="text-xl font-bold">Dashboard</h1>
            <button onClick={toggleSidebar} className="text-gray-400 hover:text-white">
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <nav className="flex-1">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveItem(item.id)}
                    className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                      activeItem === item.id ? 'bg-blue-600' : 'hover:bg-gray-800'
                    }`}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="mt-auto pb-6">
            <button className="flex items-center w-full p-3 text-red-400 hover:bg-gray-800 rounded-lg transition-colors">
              <LogOut className="mr-3 h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Semi-transparent overlay when sidebar is open */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Toggle button - always visible and positioned consistently */}
      <div className="fixed top-4 left-4 z-40">
        <button 
          onClick={toggleSidebar}
          className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>
      
     

    </div>
  );
}