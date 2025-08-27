import React, { useState } from 'react';

const DomainAnalysis = ({ API_BASE_URL, Icon, StatusBadge }) => {
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
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between"><p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p><div className="text-gray-400 dark:text-gray-500">{icon}</div></div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
        </div>
        <div className="flex items-center mt-4">
          <Icon path={changeIcon} className={`w-5 h-5 ${changeColor}`} /><p className={`ml-2 text-sm font-medium ${changeColor}`}>{change}</p><p className="ml-1 text-sm text-gray-500 dark:text-gray-400">from last month</p>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <input type="text" value={domain} onChange={(e) => setDomain(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()} placeholder="e.g., spyfu.com" className="w-full px-5 py-3 text-lg bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition duration-300" />
          <button onClick={handleAnalyze} disabled={isLoading} className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed">
            {isLoading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>
        {error && <p className="text-red-500 text-center mt-2">{error}</p>}
      </div>
      {isLoading && <div className="flex justify-center items-center mt-12"><div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div></div>}
      {analysisResult && (
        <div className="space-y-8 mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Organic Keywords" value={analysisResult.organicKeywords} icon={<Icon path="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />} change={analysisResult.organicKeywordsChange} changeType="positive" />
            <StatCard title="Paid Keywords" value={analysisResult.paidKeywords} icon={<Icon path="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.75A.75.75 0 013 4.5h.75m0 0h.75A.75.75 0 015.25 6v.75m0 0v-.75A.75.75 0 015.25 4.5h-.75m0 0h.75A.75.75 0 016.75 6v.75m0 0v-.75A.75.75 0 016.75 4.5h.75m-13.5 6.75v.75c0 .414.336.75.75.75h3a.75.75 0 00.75-.75v-.75" />} change={analysisResult.paidKeywordsChange} changeType="negative" />
            <StatCard title="Monthly Traffic" value={analysisResult.monthlyTraffic} icon={<Icon path="M2.25 18L9 11.25l4.328 4.329 7.37-7.37" />} change={analysisResult.monthlyTrafficChange} changeType="positive" />
            <StatCard title="Domain Authority" value={analysisResult.domainAuthority} icon={<Icon path="M10.5 6a7.5 7.5 0 100 15 7.5 7.5 0 000-15zM21 21l-6-6" />} change={analysisResult.domainAuthorityChange} changeType="positive" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"><h2 className="text-xl font-bold mb-4">Top Organic Keywords</h2><div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="border-b dark:border-gray-700"><th className="p-3">Keyword</th><th className="p-3">Position</th><th className="p-3">Volume</th></tr></thead><tbody>{analysisResult.topOrganicKeywords.map((kw, index) => (<tr key={index} className="border-b dark:border-gray-700 last:border-b-0"><td className="p-3">{kw.keyword}</td><td className="p-3">{kw.position}</td><td className="p-3">{kw.volume}</td></tr>))}</tbody></table></div></div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"><h2 className="text-xl font-bold mb-4">Top Paid Keywords</h2><div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="border-b dark:border-gray-700"><th className="p-3">Keyword</th><th className="p-3">CPC</th><th className="p-3">Ad Spend</th></tr></thead><tbody>{analysisResult.topPaidKeywords.map((kw, index) => (<tr key={index} className="border-b dark:border-gray-700 last:border-b-0"><td className="p-3">{kw.keyword}</td><td className="p-3">${kw.cpc.toFixed(2)}</td><td className="p-3">${kw.adSpend.toLocaleString()}</td></tr>))}</tbody></table></div></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DomainAnalysis;