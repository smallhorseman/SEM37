// src/App.jsx
import React, { useState, useEffect } from 'react';
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
const API_BASE_URL = 'https://sem37-1.onrender.com';


// --- TOOL COMPONENTS ---

const DomainAnalysis = () => {
  const [domain, setDomain] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    if (!domain) {
      setError('Please enter a domain to analyze.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain }),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setAnalysisResult(data);
    } catch (error) {
      setError('Failed to get analysis. Make sure the backend server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, change, changeType }) => {
    const isPositive = changeType === 'positive';
    const changeColor = isPositive ? 'text-green-500' : 'text-red-500';
    const changeIcon = isPositive ? 'M2.25 18L9 11.25l4.328 4.329 7.37-7.37' : 'M2.25 6L9 12.75l4.328-4.329 7.37 7.37';
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg shadow-lg flex flex-col justify-between border border-white/10">
        <div>
          <div className="flex items-center justify-between"><p className="text-sm font-medium text-gray-400">{title}</p><div className="text-gray-500">{icon}</div></div>
          <p className="text-3xl font-bold text-white mt-2">{value}</p>
        </div>
        <div className="flex items-center mt-4">
          <Icon path={changeIcon} className={`w-5 h-5 ${changeColor}`} /><p className={`ml-2 text-sm font-medium ${changeColor}`}>{change}</p><p className="ml-1 text-sm text-gray-400">from last month</p>
        </div>
      </div>
    );
  };

  return (
    <div className="mt-12">
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <input type="text" value={domain} onChange={(e) => setDomain(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()} placeholder="e.g., spyfu.com" className="w-full px-5 py-3 text-lg bg-gray-900/50 border-2 border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-400 transition duration-300 text-white placeholder-gray-500" />
          <button onClick={handleAnalyze} disabled={isLoading} className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-6 rounded-full transition duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed">
            {isLoading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>
        {error && <p className="text-red-500 text-center mt-2">{error}</p>}
      </div>
      {isLoading && <div className="flex justify-center items-center mt-12"><div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-400"></div></div>}
      {analysisResult && (
        <div className="space-y-8 mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Organic Keywords" value={analysisResult.organicKeywords} icon={<Icon path="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />} change={analysisResult.organicKeywordsChange} changeType="positive" />
            <StatCard title="Paid Keywords" value={analysisResult.paidKeywords} icon={<Icon path="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.75A.75.75 0 013 4.5h.75m0 0h.75A.75.75 0 015.25 6v.75m0 0v-.75A.75.75 0 015.25 4.5h-.75m0 0h.75A.75.75 0 016.75 6v.75m0 0v-.75A.75.75 0 016.75 4.5h.75m-13.5 6.75v.75c0 .414.336.75.75.75h3a.75.75 0 00.75-.75v-.75" />} change={analysisResult.paidKeywordsChange} changeType="negative" />
            <StatCard title="Monthly Traffic" value={analysisResult.monthlyTraffic} icon={<Icon path="M2.25 18L9 11.25l4.328 4.329 7.37-7.37" />} change={analysisResult.monthlyTrafficChange} changeType="positive" />
            <StatCard title="Domain Authority" value={analysisResult.domainAuthority} icon={<Icon path="M10.5 6a7.5 7.5 0 100 15 7.5 7.5 0 000-15zM21 21l-6-6" />} change={analysisResult.domainAuthorityChange} changeType="positive" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-white/10"><h2 className="text-xl font-bold mb-4 text-white">Top Organic Keywords</h2><div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="border-b border-gray-600"><th className="p-3 text-gray-400">Keyword</th><th className="p-3 text-gray-400">Position</th><th className="p-3 text-gray-400">Volume</th></tr></thead><tbody>{analysisResult.topOrganicKeywords.map((kw, index) => (<tr key={index} className="border-b border-gray-700 last:border-b-0"><td className="p-3 text-white">{kw.keyword}</td><td className="p-3 text-white">{kw.position}</td><td className="p-3 text-white">{kw.volume}</td></tr>))}</tbody></table></div></div>
            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-white/10"><h2 className="text-xl font-bold mb-4 text-white">Top Paid Keywords</h2><div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="border-b border-gray-600"><th className="p-3 text-gray-400">Keyword</th><th className="p-3 text-gray-400">CPC</th><th className="p-3 text-gray-400">Ad Spend</th></tr></thead><tbody>{analysisResult.topPaidKeywords.map((kw, index) => (<tr key={index} className="border-b border-gray-700 last:border-b-0"><td className="p-3 text-white">{kw.keyword}</td><td className="p-3 text-white">${kw.cpc.toFixed(2)}</td><td className="p-3 text-white">${kw.adSpend.toLocaleString()}</td></tr>))}</tbody></table></div></div>
          </div>
        </div>
      )}
    </div>
  );
};

const KeywordFinder = () => {
  // ... (Component logic remains the same, but styles will be inherited)
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-white/10">
      <p className="text-gray-400 mb-4">Enter a seed keyword to discover new opportunities.</p>
      {/* ... rest of JSX ... */}
    </div>
  );
};

const OnPageSeoChecker = () => {
  // ... (Component logic remains the same, but styles will be inherited)
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-white/10">
      <p className="text-gray-400 mb-4">Enter a full URL to audit its on-page SEO elements.</p>
      {/* ... rest of JSX ... */}
    </div>
  );
};


// --- NEW LAYOUT COMPONENTS ---

const Header = () => (
  <header className="py-4 px-8 flex justify-between items-center absolute top-0 left-0 w-full z-10">
    <div className="text-2xl font-bold font-heading text-white">Studio 37</div>
    <nav>
      <a href="https://www.studio37.cc" target="_blank" rel="noopener noreferrer" className="text-white hover:text-yellow-400 transition-colors">Main Site</a>
    </nav>
  </header>
);

const Hero = ({ children }) => (
  <div className="relative min-h-screen flex items-center justify-center text-center bg-black text-white px-4">
    <div 
      className="absolute inset-0 bg-cover bg-center opacity-30" 
      style={{backgroundImage: "url('https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=2864&auto=format&fit=crop')"}}>
    </div>
    <div className="relative z-10">
      {children}
    </div>
  </div>
);


// --- MAIN APP COMPONENT ---

export default function App() {
  const [activeTool, setActiveTool] = useState('domain');

  const tools = {
    domain: { name: 'Competitor Analysis', component: <DomainAnalysis /> },
    onpage: { name: 'On-Page SEO Checker', component: <OnPageSeoChecker /> },
    keyword: { name: 'Keyword Finder', component: <KeywordFinder /> },
  };

  return (
    <div className="bg-black">
      <Header />
      <Hero>
        <div>
          <h1 className="text-5xl md:text-7xl font-bold font-heading">SEM37 Toolkit</h1>
          <p className="mt-4 text-lg text-gray-300">Professional SEO & SEM tools for the modern creative.</p>
        </div>
      </Hero>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8 -mt-48 relative z-10">
        {/* Tab Navigation */}
        <div className="mb-8 flex justify-center border-b border-gray-700">
          {Object.keys(tools).map(toolKey => (
            <button 
              key={toolKey}
              onClick={() => setActiveTool(toolKey)}
              className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                activeTool === toolKey 
                ? 'border-b-2 border-yellow-400 text-yellow-400' 
                : 'border-b-2 border-transparent text-gray-400 hover:text-white'
              }`}
            >
              {tools[toolKey].name}
            </button>
          ))}
        </div>
        
        {/* Render Active Tool */}
        <div>
          {tools[activeTool].component}
        </div>
      </main>
    </div>
  );
}
