import React, { useState, useEffect, lazy, Suspense } from 'react';

// --- HELPER COMPONENTS ---

const StatusBadge = ({ status }) => {
  const styles = {
    good: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
  };
  const text = status.charAt(0).toUpperCase() + status.slice(1);
  return <span className={`text-xs font-medium me-2 px-2.5 py-0.5 rounded ${styles[status]}`}>{text}</span>;
};

// --- API Configuration ---
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000';


// --- LAZY LOADED TOOL COMPONENTS ---
const DomainAnalysis = lazy(() => import('./DomainAnalysis'));
const KeywordFinder = lazy(() => import('./KeywordFinder'));
const OnPageSeoChecker = lazy(() => import('./OnPageSeoChecker'));

// --- MAIN APP COMPONENT ---

export default function App() {
  const [activeTool, setActiveTool] = useState('domain');

  const tools = {
    domain: { name: 'Competitor Analysis', component: <DomainAnalysis API_BASE_URL={API_BASE_URL} StatusBadge={StatusBadge} /> },
    onpage: { name: 'On-Page SEO Checker', component: <OnPageSeoChecker API_BASE_URL={API_BASE_URL} StatusBadge={StatusBadge} /> },
    keyword: { name: 'Keyword Finder', component: <KeywordFinder API_BASE_URL={API_BASE_URL} /> },
  };

  return (
    <div className="bg-studio-bg min-h-screen font-sans text-studio-primary">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-studio-primary">SEM37</h1>
          <p className="text-gray-600 mt-2">Your All-in-One SEO & SEM Toolkit</p>
        </header>

        {/* Tab Navigation */}
        <div className="mb-8 flex justify-center border-b border-gray-300">
          {Object.keys(tools).map(toolKey => (
            <button 
              key={toolKey}
              onClick={() => setActiveTool(toolKey)}
              className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                activeTool === toolKey 
                ? 'border-b-2 border-studio-button text-studio-button'
                : 'border-b-2 border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              {tools[toolKey].name}
            </button>
          ))}
        </div>
        
        {/* Render Active Tool */}
        <main>
          <Suspense fallback={<div className="text-center p-8 text-gray-500">Loading tool...</div>}>
            {tools[activeTool].component}
          </Suspense>
        </main>

      </div>
    </div>
  );
}
