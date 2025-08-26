// src/App.jsx
import React, { useState } from 'react';
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
      if (!response.ok) {
        const errData = await response.json().catch(() => ({error: "An unknown error occurred."}));
        throw new Error(errData.error || 'Network response was not ok');
      }
      const data = await response.json();
      setAnalysisResult(data);
    } catch (err) {
      setError(err.message || 'Failed to get analysis. Make sure the backend server is running.');
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
          <input type="text" value={domain} onChange={(e) => setDomain(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()} placeholder="e.g., studio37.cc" className="w-full px-5 py-3 text-lg bg-gray-900/50 border-2 border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-400 transition duration-300 text-white placeholder-gray-500" />
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
  const [keyword, setKeyword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!keyword) {
      setError('Please enter a keyword to search.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setResults([]);
    setHasSearched(true);
    try {
      const response = await fetch(`${API_BASE_URL}/keyword_finder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword }),
      });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({error: "An unknown error occurred."}));
        throw new Error(errData.error || 'Network response was not ok');
      }
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err.message || 'Failed to get keywords. Make sure the backend server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-white/10">
      <p className="text-gray-400 mb-4">Enter a seed keyword to discover new opportunities.</p>
      <div className="flex flex-col sm:flex-row gap-2 mb-6">
        <input type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} placeholder="e.g., wedding photography" className="flex-grow px-4 py-2 bg-gray-900/50 border-2 border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white placeholder-gray-500" />
        <button onClick={handleSearch} disabled={isLoading} className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-6 rounded-md transition duration-300 disabled:bg-gray-600 flex items-center justify-center">
          {isLoading ? <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-black"></div> : <Icon path="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" className="w-5 h-5 mr-2" />}
          {isLoading ? 'Searching...' : 'Find Keywords'}
        </button>
      </div>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead><tr className="border-b border-gray-600"><th className="p-3 text-gray-400">Keyword</th><th className="p-3 text-gray-400">Search Volume</th><th className="p-3 text-gray-400">CPC (USD)</th><th className="p-3 text-gray-400">Difficulty</th></tr></thead>
          <tbody>
            {isLoading && <tr><td colSpan="4" className="text-center p-6"><p className="text-gray-500">Fetching keyword data...</p></td></tr>}
            {results.length > 0 && !isLoading && results.map((res, index) => (
              <tr key={index} className="border-b border-gray-700 last:border-b-0 hover:bg-gray-700/50">
                <td className="p-3 font-medium text-white">{res.keyword}</td><td className="p-3 text-white">{res.volume.toLocaleString()}</td><td className="p-3 text-white">${res.cpc.toFixed(2)}</td>
                <td className="p-3"><span className={`text-xs font-medium me-2 px-2.5 py-0.5 rounded ${res.difficulty > 80 ? 'bg-red-900 text-red-300' : res.difficulty > 60 ? 'bg-yellow-900 text-yellow-300' : 'bg-green-900 text-green-300'}`}>{res.difficulty}</span></td>
              </tr>
            ))}
            {!isLoading && results.length === 0 && <tr><td colSpan="4" className="text-center p-6"><p className="text-gray-500">{hasSearched ? 'No results found.' : 'Your results will appear here.'}</p></td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const OnPageSeoChecker = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    if (!url) {
      setError('Please enter a URL to analyze.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setResults(null);
    try {
      const response = await fetch(`${API_BASE_URL}/on_page_seo_check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await response.json();
      if (!response.ok) {
         const errData = await response.json().catch(() => ({error: "An unknown error occurred."}));
        throw new Error(errData.error || 'An error occurred.');
      }
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const GeminiRecommendations = ({ recommendations }) => {
    const renderedHtml = marked(recommendations || '');
    return (
      <div className="mt-8">
        <h3 className="font-bold text-xl mb-3 flex items-center text-yellow-400"><Icon path="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.562L16.25 21.75l-.648-1.188a2.25 2.25 0 01-1.423-1.423L13.25 18l1.188-.648a2.25 2.25 0 011.423-1.423L16.25 15l.648 1.188a2.25 2.25 0 011.423 1.423L19.75 18l-1.188.648a2.25 2.25 0 01-1.423 1.423z" className="w-6 h-6 mr-2" />AI-Powered Strategy</h3>
        <div className="prose prose-sm prose-invert bg-gray-900/50 p-4 rounded-md border border-white/10" dangerouslySetInnerHTML={{ __html: renderedHtml }}></div>
      </div>
    );
  };
  
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-white/10">
      <p className="text-gray-400 mb-4">Enter a full URL to audit its on-page SEO elements.</p>
      <div className="flex flex-col sm:flex-row gap-2 mb-6">
        <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()} placeholder="e.g., https://www.studio37.cc" className="flex-grow px-4 py-2 bg-gray-900/50 border-2 border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white placeholder-gray-500" />
        <button onClick={handleAnalyze} disabled={isLoading} className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-6 rounded-md transition duration-300 disabled:bg-gray-600 flex items-center justify-center">
          {isLoading ? <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-black"></div> : <Icon path="M9.75 3.104v5.714a2.25 2.25 0 01-.5 1.591L5.25 12.5M9.75 3.104a2.25 2.25 0 00-3.422-.243L4.25 5.5M9.75 3.104a2.25 2.25 0 013.422-.243l2.028 2.646M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-5 h-5 mr-2" />}
          {isLoading ? 'Auditing...' : 'Audit Page'}
        </button>
      </div>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {isLoading && <div className="text-center p-6"><p className="text-gray-500">Analyzing page content and generating AI strategy...</p></div>}
      {results && (
        <div className="space-y-6">
            <div><h3 className="font-bold text-lg mb-2 text-white">Title Tag</h3><div className="p-4 bg-gray-900/50 rounded-md"><p className="font-mono break-words text-gray-300">"{results.title.text || 'Not Found'}"</p><div className="flex items-center mt-2 text-sm"><StatusBadge status={results.title.status} /><span>Length: {results.title.length} characters (Recommended: 50-60)</span></div></div></div>
            <div><h3 className="font-bold text-lg mb-2 text-white">Meta Description</h3><div className="p-4 bg-gray-900/50 rounded-md"><p className="break-words text-gray-400">"{results.metaDescription.text || 'Not Found'}"</p><div className="flex items-center mt-2 text-sm"><StatusBadge status={results.metaDescription.status} /><span>Length: {results.metaDescription.length} characters (Recommended: 150-160)</span></div></div></div>
            <div><h3 className="font-bold text-lg mb-2 text-white">H1 Tags</h3><div className="p-4 bg-gray-900/50 rounded-md"><ul className="list-disc list-inside text-gray-300">{results.h1.tags.length > 0 ? results.h1.tags.map((tag, i) => <li key={i}>{tag}</li>) : <li>No H1 tags found.</li>}</ul><div className="flex items-center mt-2 text-sm"><StatusBadge status={results.h1.status} /><span>Found: {results.h1.count} (Recommended: 1)</span></div></div></div>
            <div><h3 className="font-bold text-lg mb-2 text-white">Content</h3><div className="p-4 bg-gray-900/50 rounded-md"><p>Total word count: <span className="font-bold">{results.wordCount.toLocaleString()}</span></p></div></div>
            <div><h3 className="font-bold text-lg mb-2 text-white">Image SEO</h3><div className="p-4 bg-gray-900/50 rounded-md max-h-60 overflow-y-auto"><ul className="space-y-2">{results.images.map((img, i) => (<li key={i} className="flex items-start text-sm"><StatusBadge status={img.status} /><span className="font-mono break-all text-gray-400">{img.src}</span></li>))}</ul></div></div>
            {results.recommendations && <GeminiRecommendations recommendations={results.recommendations} />}
        </div>
      )}
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
