import React, { useState } from 'react';

const KeywordFinder = ({ API_BASE_URL }) => {
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
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setResults(data);
    } catch (error) {
      setError('Failed to get keywords. Make sure the backend server is running.');
    } finally {
      setIsLoading(false);
    };
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <p className="text-gray-600 mb-4">Enter a seed keyword to discover new opportunities.</p>
      <div className="flex flex-col sm:flex-row gap-2 mb-6">
        <input type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} placeholder="e.g., seo tool" className="flex-grow px-4 py-2 bg-white border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-studio-button" />
        <button onClick={handleSearch} disabled={isLoading} className="bg-studio-button hover:bg-studio-button-hover text-white font-bold py-2 px-6 rounded-md transition duration-300 disabled:bg-gray-400 flex items-center justify-center">
          {isLoading ? <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div> : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>}
          {isLoading ? 'Searching...' : 'Find Keywords'}
        </button>
      </div>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead><tr className="border-b"><th className="p-3">Keyword</th><th className="p-3">Search Volume</th><th className="p-3">CPC (USD)</th><th className="p-3">Difficulty</th></tr></thead>
          <tbody>
            {isLoading && <tr><td colSpan="4" className="text-center p-6"><p className="text-gray-500">Fetching keyword data...</p></td></tr>}
            {results.length > 0 && !isLoading && results.map((res, index) => (
              <tr key={index} className="border-b last:border-b-0 hover:bg-gray-50">
                <td className="p-3 font-medium">{res.keyword}</td><td className="p-3">{res.volume.toLocaleString()}</td><td className="p-3">${res.cpc.toFixed(2)}</td>
                <td className="p-3"><span className={`text-xs font-medium me-2 px-2.5 py-0.5 rounded ${res.difficulty > 80 ? 'bg-red-100 text-red-800' : res.difficulty > 60 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>{res.difficulty}</span></td>
              </tr>
            ))}
            {!isLoading && results.length === 0 && <tr><td colSpan="4" className="text-center p-6"><p className="text-gray-500">{hasSearched ? 'No results found.' : 'Your results will appear here.'}</p></td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default KeywordFinder;