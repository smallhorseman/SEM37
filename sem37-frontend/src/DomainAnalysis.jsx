import React, { useState } from 'react';

const DomainAnalysis = ({ API_BASE_URL, StatusBadge }) => {
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

  const StatCard = ({ title, value, change, changeType }) => {
    const isPositive = changeType === 'positive';
    const changeColor = isPositive ? 'text-green-500' : 'text-red-500';
    const changeIcon = isPositive ? 'M2.25 18L9 11.25l4.328 4.329 7.37-7.37' : 'M2.25 6L9 12.75l4.328-4.329 7.37 7.37';
    return (
      <div className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between"><p className="text-sm font-medium text-gray-500">{title}</p></div>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className="flex items-center mt-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${changeColor}`}><path strokeLinecap="round" strokeLinejoin="round" d={changeIcon} /></svg><p className={`ml-2 text-sm font-medium ${changeColor}`}>{change}</p><p className="ml-1 text-sm text-gray-500">from last month</p>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <input type="text" value={domain} onChange={(e) => setDomain(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()} placeholder="e.g., spyfu.com" className="w-full px-5 py-3 text-lg bg-white border-2 border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-studio-button transition duration-300" />
          <button onClick={handleAnalyze} disabled={isLoading} className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-studio-button hover:bg-studio-button-hover text-white font-bold py-2 px-6 rounded-full transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed">
            {isLoading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>
        {error && <p className="text-red-500 text-center mt-2">{error}</p>}
      </div>
      {isLoading && <div className="flex justify-center items-center mt-12"><div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-studio-button"></div></div>}
      {analysisResult && (
        <div className="space-y-8 mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Organic Keywords" value={analysisResult.organicKeywords} change={analysisResult.organicKeywordsChange} changeType="positive" />
            <StatCard title="Paid Keywords" value={analysisResult.paidKeywords} change={analysisResult.paidKeywordsChange} changeType="negative" />
            <StatCard title="Monthly Traffic" value={analysisResult.monthlyTraffic} change={analysisResult.monthlyTrafficChange} changeType="positive" />
            <StatCard title="Domain Authority" value={analysisResult.domainAuthority} change={analysisResult.domainAuthorityChange} changeType="positive" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md"><h2 className="text-xl font-bold mb-4">Top Organic Keywords</h2><div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="border-b"><th className="p-3">Keyword</th><th className="p-3">Position</th><th className="p-3">Volume</th></tr></thead><tbody>{analysisResult.topOrganicKeywords.map((kw, index) => (<tr key={index} className="border-b last:border-b-0"><td className="p-3">{kw.keyword}</td><td className="p-3">{kw.position}</td><td className="p-3">{kw.volume}</td></tr>))}</tbody></table></div></div>
            <div className="bg-white p-6 rounded-lg shadow-md"><h2 className="text-xl font-bold mb-4">Top Paid Keywords</h2><div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="border-b"><th className="p-3">Keyword</th><th className="p-3">CPC</th><th className="p-3">Ad Spend</th></tr></thead><tbody>{analysisResult.topPaidKeywords.map((kw, index) => (<tr key={index} className="border-b last:border-b-0"><td className="p-3">{kw.keyword}</td><td className="p-3">${kw.cpc.toFixed(2)}</td><td className="p-3">${kw.adSpend.toLocaleString()}</td></tr>))}</tbody></table></div></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DomainAnalysis;