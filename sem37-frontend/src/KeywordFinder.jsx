// src/KeywordFinder.jsx
import React, { useState } from 'react';

// Reusable Icon component
const Icon = ({ path, className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
  </svg>
);

export default function KeywordFinder() {
  const [keyword, setKeyword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  // State to track if a search has been performed
  const [hasSearched, setHasSearched] = useState(false);


  const handleSearch = async () => {
    if (!keyword) {
      setError('Please enter a keyword to search.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setResults([]);
    setHasSearched(true); // Mark that a search has been attempted

    try {
      // --- Live API Call ---
      // This now calls your actual backend endpoint.
      const response = await fetch('http://127.0.0.1:5000/keyword_finder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keyword }),
      });

      if (!response.ok) {
        // Handle HTTP errors like 404 or 500
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setResults(data);

    } catch (error) {
      console.error("Failed to fetch keywords:", error);
      setError('Failed to get keywords. Make sure the backend server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-bold mb-4">Keyword Finder</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-4">Enter a seed keyword to discover new opportunities.</p>
      
      <div className="flex flex-col sm:flex-row gap-2 mb-6">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()} // Allow searching with Enter key
          placeholder="e.g., seo tool"
          className="flex-grow px-4 py-2 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md transition duration-300 disabled:bg-gray-400 flex items-center justify-center"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
          ) : (
            <Icon path="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" className="w-5 h-5 mr-2" />
          )}
          {isLoading ? 'Searching...' : 'Find Keywords'}
        </button>
      </div>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {/* Results Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b dark:border-gray-700">
              <th className="p-3">Keyword</th>
              <th className="p-3">Search Volume</th>
              <th className="p-3">CPC (USD)</th>
              <th className="p-3">Difficulty</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan="4" className="text-center p-6">
                    <p className="text-gray-500">Fetching keyword data...</p>
                </td>
              </tr>
            )}
            {results.length > 0 && !isLoading && results.map((res, index) => (
              <tr key={index} className="border-b dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="p-3 font-medium">{res.keyword}</td>
                <td className="p-3">{res.volume.toLocaleString()}</td>
                <td className="p-3">${res.cpc.toFixed(2)}</td>
                <td className="p-3">
                    <span className={`text-xs font-medium me-2 px-2.5 py-0.5 rounded ${
                        res.difficulty > 80 ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                        res.difficulty > 60 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                    }`}>
                        {res.difficulty}
                    </span>
                </td>
              </tr>
            ))}
            {!isLoading && results.length === 0 && (
                 <tr>
                    <td colSpan="4" className="text-center p-6">
                        <p className="text-gray-500">
                          {hasSearched ? 'No results found.' : 'Your results will appear here.'}
                        </p>
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

