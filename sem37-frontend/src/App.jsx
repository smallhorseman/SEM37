import React, { useState, useEffect, lazy, Suspense } from 'react';
import { marked } from 'marked';

// --- HELPER COMPONENTS ---

const Icon = ({ path, className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
  </svg>
);

const StatusBadge = ({ status }) => {
  const styles = {
    good: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
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

const GeminiRecommendations = ({ recommendations }) => {
  const renderedHtml = marked(recommendations || '');
  return (
    <div className="mt-8">
      <h3 className="font-bold text-xl mb-3 flex items-center"><Icon path="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.562L16.25 21.75l-.648-1.188a2.25 2.25 0 01-1.423-1.423L13.25 18l1.188-.648a2.25 2.25 0 011.423-1.423L16.25 15l.648 1.188a2.25 2.25 0 011.423 1.423L19.75 18l-1.188.648a2.25 2.25 0 01-1.423 1.423z" className="w-6 h-6 mr-2 text-blue-500" />AI-Powered Strategy</h3>
      <div className="prose prose-sm dark:prose-invert bg-blue-50 dark:bg-gray-700/50 p-4 rounded-md" dangerouslySetInnerHTML={{ __html: renderedHtml }}></div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---

export default function App() {
  const [activeTool, setActiveTool] = useState('domain');

  const tools = {
    domain: { name: 'Competitor Analysis', component: <DomainAnalysis API_BASE_URL={API_BASE_URL} Icon={Icon} StatusBadge={StatusBadge} /> },
    onpage: { name: 'On-Page SEO Checker', component: <OnPageSeoChecker API_BASE_URL={API_BASE_URL} Icon={Icon} StatusBadge={StatusBadge} GeminiRecommendations={GeminiRecommendations} /> },
    keyword: { name: 'Keyword Finder', component: <KeywordFinder API_BASE_URL={API_BASE_URL} Icon={Icon} /> },
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen font-sans text-gray-900 dark:text-gray-100">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white">SEM37</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Your All-in-One SEO & SEM Toolkit</p>
        </header>

        {/* Tab Navigation */}
        <div className="mb-8 flex justify-center border-b border-gray-300 dark:border-gray-700">
          {Object.keys(tools).map(toolKey => (
            <button 
              key={toolKey}
              onClick={() => setActiveTool(toolKey)}
              className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                activeTool === toolKey 
                ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400' 
                : 'border-b-2 border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              {tools[toolKey].name}
            </button>
          ))}
        </div>
        
        {/* Render Active Tool */}
        <main>
          <Suspense fallback={<div className="text-center p-8 text-gray-500 dark:text-gray-400">Loading tool...</div>}>
            {tools[activeTool].component}
          </Suspense>
        </main>

      </div>
    </div>
  );
}
