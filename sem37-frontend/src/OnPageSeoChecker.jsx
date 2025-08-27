import React, { useState } from 'react';
import { marked } from 'marked';

const OnPageSeoChecker = ({ API_BASE_URL, Icon, StatusBadge, GeminiRecommendations }) => {
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
      if (!response.ok) throw new Error(data.error || 'An error occurred.');
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <p className="text-gray-600 dark:text-gray-400 mb-4">Enter a full URL to audit its on-page SEO elements.</p>
      <div className="flex flex-col sm:flex-row gap-2 mb-6">
        <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()} placeholder="e.g., https://www.yourblog.com/your-post" className="flex-grow px-4 py-2 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <button onClick={handleAnalyze} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md transition duration-300 disabled:bg-gray-400 flex items-center justify-center">
          {isLoading ? <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div> : <Icon path="M9.75 3.104v5.714a2.25 2.25 0 01-.5 1.591L5.25 12.5M9.75 3.104a2.25 2.25 0 00-3.422-.243L4.25 5.5M9.75 3.104a2.25 2.25 0 013.422-.243l2.028 2.646M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-5 h-5 mr-2" />}
          {isLoading ? 'Auditing...' : 'Audit Page'}
        </button>
      </div>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {isLoading && <div className="text-center p-6"><p className="text-gray-500">Analyzing page content and generating AI strategy...</p></div>}
      {results && (
        <div className="space-y-6">
            <div><h3 className="font-bold text-lg mb-2">Title Tag</h3><div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-md"><p className="font-mono break-words">"{results.title.text || 'Not Found'}"</p><div className="flex items-center mt-2 text-sm"><StatusBadge status={results.title.status} /><span>Length: {results.title.length} characters (Recommended: 50-60)</span></div></div></div>
            <div><h3 className="font-bold text-lg mb-2">Meta Description</h3><div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-md"><p className="break-words text-gray-600 dark:text-gray-400">"{results.metaDescription.text || 'Not Found'}"</p><div className="flex items-center mt-2 text-sm"><StatusBadge status={results.metaDescription.status} /><span>Length: {results.metaDescription.length} characters (Recommended: 150-160)</span></div></div></div>
            <div><h3 className="font-bold text-lg mb-2">H1 Tags</h3><div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-md"><ul className="list-disc list-inside">{results.h1.tags.length > 0 ? results.h1.tags.map((tag, i) => <li key={i}>{tag}</li>) : <li>No H1 tags found.</li>}</ul><div className="flex items-center mt-2 text-sm"><StatusBadge status={results.h1.status} /><span>Found: {results.h1.count} (Recommended: 1)</span></div></div></div>
            <div><h3 className="font-bold text-lg mb-2">Content</h3><div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-md"><p>Total word count: <span className="font-bold">{results.wordCount.toLocaleString()}</span></p></div></div>
            <div><h3 className="font-bold text-lg mb-2">Image SEO</h3><div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-md max-h-60 overflow-y-auto"><ul className="space-y-2">{results.images.map((img, i) => (<li key={i} className="flex items-start text-sm"><StatusBadge status={img.status} /><span className="font-mono break-all">{img.src}</span></li>))}</ul></div></div>
            {results.recommendations && <GeminiRecommendations recommendations={results.recommendations} />}
        </div>
      )}
    </div>
  );
};

export default OnPageSeoChecker;