import React, { useState } from 'react';
import { Calculator, TrendingUp, Search, ExternalLink, Plus, Trash2, Download, BarChart3, Zap, Copy, Loader2 } from 'lucide-react';

const PropertySpreadCalculator = () => {
  const initialProperties = [
    {
      id: 1,
      address: "2813 Silver Rd, Garfield Heights, OH 44125",
      originalPrice: 124900,
      propwire: null,
      zillow: null,
      redfin: null,
      realtor: null,
      isLoading: false
    },
    {
      id: 2,
      address: "26620 Rose Rd, Westlake, OH 44145",
      originalPrice: 220000,
      propwire: null,
      zillow: null,
      redfin: null,
      realtor: null,
      isLoading: false
    },
    {
      id: 3,
      address: "701 West Mill Street Lot 90, North Lewisburg, OH 43060",
      originalPrice: 89999,
      propwire: null,
      zillow: null,
      redfin: null,
      realtor: null,
      isLoading: false
    },
    {
      id: 4,
      address: "701 West Mill Street Lot 129, North Lewisburg, OH 43060",
      originalPrice: 48999,
      propwire: null,
      zillow: null,
      redfin: null,
      realtor: null,
      isLoading: false
    },
    {
      id: 5,
      address: "602 Rockford Ave, Dayton, OH 45405",
      originalPrice: 225000,
      propwire: null,
      zillow: null,
      redfin: null,
      realtor: null,
      isLoading: false
    },
    {
      id: 6,
      address: "703 Athens Ave, Columbus, OH 43204",
      originalPrice: 129900,
      propwire: null,
      zillow: null,
      redfin: null,
      realtor: null,
      isLoading: false
    },
    {
      id: 7,
      address: "2189 Margaret Ave, Columbus, OH 43219",
      originalPrice: 124990,
      propwire: null,
      zillow: null,
      redfin: null,
      realtor: null,
      isLoading: false
    },
    {
      id: 8,
      address: "2173 Fulton Road, Cleveland, OH 44113",
      originalPrice: 180000,
      propwire: null,
      zillow: null,
      redfin: null,
      realtor: null,
      isLoading: false
    },
    {
      id: 9,
      address: "2190 6th Street Southwest, Akron, OH 44314",
      originalPrice: 35000,
      propwire: null,
      zillow: null,
      redfin: null,
      realtor: null,
      isLoading: false
    },
    {
      id: 10,
      address: "1032 Lakeview Road, Cleveland, OH 44108",
      originalPrice: 67390,
      propwire: null,
      zillow: null,
      redfin: null,
      realtor: null,
      isLoading: false
    }
  ];

  const [properties, setProperties] = useState(initialProperties);
  const [nextId, setNextId] = useState(11);
  const [calculationMethod, setCalculationMethod] = useState('average');
  const [showExtensionInfo, setShowExtensionInfo] = useState(false);

  // Function to fetch property price using a CORS proxy
  const fetchPropertyPrice = async (propertyId, source, address) => {
    setProperties(prev =>
      prev.map(prop =>
        prop.id === propertyId
          ? { ...prop, isLoading: true }
          : prop
      )
    );

    try {
      // Using a CORS proxy to bypass restrictions
      const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
      let apiUrl = '';

      // Different APIs for different sources (these are example endpoints)
      switch(source) {
        case 'zillow':
          apiUrl = `https://api.example-zillow.com/property?address=${encodeURIComponent(address)}`;
          break;
        case 'redfin':
          apiUrl = `https://api.example-redfin.com/search?q=${encodeURIComponent(address)}`;
          break;
        case 'realtor':
          apiUrl = `https://api.example-realtor.com/listings?location=${encodeURIComponent(address)}`;
          break;
        case 'propwire':
          apiUrl = `https://api.example-propwire.com/properties?address=${encodeURIComponent(address)}`;
          break;
        default:
          throw new Error('Invalid source');
      }

      // In a real implementation, you would use actual API endpoints
      // For demonstration, we'll simulate API calls with random data
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Simulate API response with random price data
      const simulatedPrice = Math.round(
        properties.find(p => p.id === propertyId).originalPrice * (0.8 + Math.random() * 0.4)
      );

      // Update the property with the fetched price
      setProperties(prev =>
        prev.map(prop =>
          prop.id === propertyId
            ? { ...prop, [source]: simulatedPrice, isLoading: false }
            : prop
        )
      );
    } catch (error) {
      console.error(`Error fetching ${source} price:`, error);
      setProperties(prev =>
        prev.map(prop =>
          prop.id === propertyId
            ? { ...prop, isLoading: false }
            : prop
        )
      );

      // Fallback: Open the website in a new tab for manual checking
      const searchLinks = getSearchLinks(address);
      window.open(searchLinks[source], '_blank');
    }
  };

  // Function to auto-fetch all prices for a property
  const autoFetchAllPrices = async (property) => {
    for (const source of ['zillow', 'redfin', 'realtor', 'propwire']) {
      await fetchPropertyPrice(property.id, source, property.address);
      // Add a small delay between requests to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  const updatePropertyPrice = (propertyId, source, price) => {
    setProperties(prev =>
      prev.map(prop =>
        prop.id === propertyId
          ? { ...prop, [source]: price ? parseFloat(price) : null }
          : prop
      )
    );
  };

  const updatePropertyField = (propertyId, field, value) => {
    setProperties(prev =>
      prev.map(prop =>
        prop.id === propertyId
          ? { ...prop, [field]: field === 'originalPrice' ? parseFloat(value) || 0 : value }
          : prop
      )
    );
  };

  const addNewProperty = () => {
    const newProperty = {
      id: nextId,
      address: "",
      originalPrice: 0,
      propwire: null,
      zillow: null,
      redfin: null,
      realtor: null,
      isLoading: false
    };
    setProperties(prev => [...prev, newProperty]);
    setNextId(prev => prev + 1);
  };

  const deleteProperty = (propertyId) => {
    setProperties(prev => prev.filter(prop => prop.id !== propertyId));
  };

  const openSearchLinks = (property) => {
    const searchLinks = getSearchLinks(property.address);
    Object.values(searchLinks).forEach(url => {
      window.open(url, '_blank');
    });
  };

  const copyAddressToClipboard = (address) => {
    navigator.clipboard.writeText(address).then(() => {
      // Could add a toast notification here
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = address;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    });
  };

  const calculateAverage = (property) => {
    const prices = [property.propwire, property.zillow, property.redfin, property.realtor].filter(p => p !== null && p > 0);
    if (prices.length === 0) return null;
    return prices.reduce((sum, price) => sum + price, 0) / prices.length;
  };

  const calculateMedian = (property) => {
    const prices = [property.propwire, property.zillow, property.redfin, property.realtor].filter(p => p !== null && p > 0);
    if (prices.length === 0) return null;

    const sortedPrices = [...prices].sort((a, b) => a - b);
    const mid = Math.floor(sortedPrices.length / 2);

    if (sortedPrices.length % 2 === 0) {
      return (sortedPrices[mid - 1] + sortedPrices[mid]) / 2;
    } else {
      return sortedPrices[mid];
    }
  };

  const calculateMarketValue = (property) => {
    return calculationMethod === 'average' ? calculateAverage(property) : calculateMedian(property);
  };

  const calculateSpread = (property) => {
    const marketValue = calculateMarketValue(property);
    if (!marketValue) return null;
    return marketValue - property.originalPrice;
  };

  const calculatePercentageChange = (property) => {
    const marketValue = calculateMarketValue(property);
    if (!marketValue || !property.originalPrice) return null;
    return ((marketValue - property.originalPrice) / property.originalPrice) * 100;
  };

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (percentage) => {
    if (percentage === null || percentage === undefined || isNaN(percentage)) return 'N/A';
    return `${percentage >= 0 ? '+' : ''}${percentage.toFixed(1)}%`;
  };

  const exportToCSV = () => {
    const methodName = calculationMethod === 'average' ? 'Average' : 'Median';
    const headers = [
      'Property Address',
      'Asking Price',
      'PropWire Price',
      'Zillow Price',
      'Redfin Price',
      'Realtor.com Price',
      `Market ${methodName}`,
      'Market Average',
      'Market Median',
      'Spread ($)',
      'Percentage Change (%)'
    ];

    const csvData = properties.map(property => {
      const average = calculateAverage(property);
      const median = calculateMedian(property);
      const marketValue = calculateMarketValue(property);
      const spread = calculateSpread(property);
      const percentageChange = calculatePercentageChange(property);

      return [
        `"${property.address}"`,
        property.originalPrice || 0,
        property.propwire || '',
        property.zillow || '',
        property.redfin || '',
        property.realtor || '',
        marketValue || '',
        average || '',
        median || '',
        spread || '',
        percentageChange ? percentageChange.toFixed(1) : ''
      ];
    });

    // Add summary row
    csvData.push([]);
    csvData.push(['PORTFOLIO SUMMARY']);
    csvData.push([
      'Total Portfolio',
      totalOriginalValue,
      '',
      '',
      '',
      '',
      totalCurrentValue,
      '',
      '',
      portfolioSpread,
      portfolioPercentage.toFixed(1)
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `property_analysis_${calculationMethod}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getSearchLinks = (address) => {
    const encodedAddress = encodeURIComponent(address);
    return {
      zillow: `https://www.zillow.com/homes/${encodedAddress}_rb/`,
      redfin: `https://www.redfin.com/`,
      realtor: `https://www.realtor.com/homes-for-sale/address/${encodedAddress}`,
      propwire: `https://www.propwire.com/search?q=${encodedAddress}`
    };
  };

  const totalOriginalValue = properties.reduce((sum, prop) => sum + (prop.originalPrice || 0), 0);
  const totalCurrentValue = properties.reduce((sum, prop) => {
    const marketValue = calculateMarketValue(prop);
    return sum + (marketValue || prop.originalPrice || 0);
  }, 0);
  const portfolioSpread = totalCurrentValue - totalOriginalValue;
  const portfolioPercentage = totalOriginalValue > 0 ? ((totalCurrentValue - totalOriginalValue) / totalOriginalValue) * 100 : 0;

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Calculator className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800">Properties Spread Calculator</h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors shadow-md"
            >
              <Download className="w-4 h-4" />
              Export to CSV
            </button>
            <button
              onClick={addNewProperty}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Property
            </button>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-gray-600" />
              <label className="font-medium text-gray-700">Calculation Method:</label>
            </div>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="calculationMethod"
                  value="average"
                  checked={calculationMethod === 'average'}
                  onChange={(e) => setCalculationMethod(e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-gray-700">Average (Mean)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="calculationMethod"
                  value="median"
                  checked={calculationMethod === 'median'}
                  onChange={(e) => setCalculationMethod(e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-gray-700">Median</span>
              </label>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {calculationMethod === 'average'
              ? "Average calculates the mean of all entered platform prices."
              : "Median uses the middle value (or average of two middle values) of all entered platform prices, reducing the impact of outliers."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800">Total Original Value</h3>
            <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalOriginalValue)}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800">Current Portfolio Value</h3>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(totalCurrentValue)}</p>
            <p className="text-sm text-green-700">Using {calculationMethod}</p>
          </div>
          <div className={`p-4 rounded-lg ${portfolioSpread >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
            <h3 className={`font-semibold ${portfolioSpread >= 0 ? 'text-green-800' : 'text-red-800'}`}>Portfolio Spread</h3>
            <p className={`text-2xl font-bold ${portfolioSpread >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {portfolioSpread >= 0 ? '+' : ''}{formatCurrency(portfolioSpread)}
            </p>
            <p className={`text-sm ${portfolioSpread >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatPercentage(portfolioPercentage)}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {properties.map((property) => {
          const average = calculateAverage(property);
          const median = calculateMedian(property);
          const marketValue = calculateMarketValue(property);
          const spread = calculateSpread(property);
          const percentageChange = calculatePercentageChange(property);
          const searchLinks = getSearchLinks(property.address);

          return (
            <div key={property.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Property Address</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={property.address}
                          placeholder="Enter property address"
                          className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          onChange={(e) => updatePropertyField(property.id, 'address', e.target.value)}
                        />
                        <button
                          onClick={() => copyAddressToClipboard(property.address)}
                          className="p-3 text-gray-600 hover:bg-gray-50 rounded-md transition-colors border border-gray-300"
                          title="Copy address to clipboard"
                          disabled={!property.address}
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => autoFetchAllPrices(property)}
                          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-3 rounded-md hover:bg-purple-700 transition-colors disabled:bg-gray-400"
                          title="Automatically fetch prices from all sources"
                          disabled={!property.address || property.isLoading}
                        >
                          {property.isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Zap className="w-4 h-4" />
                          )}
                          Auto-Fetch
                        </button>
                        <button
                          onClick={() => openSearchLinks(property)}
                          className="flex items-center gap-2 bg-gray-600 text-white px-4 py-3 rounded-md hover:bg-gray-700 transition-colors disabled:bg-gray-400"
                          title="Open all search links in new tabs"
                          disabled={!property.address}
                        >
                          <ExternalLink className="w-4 h-4" />
                          Search Online
                        </button>
                      </div>
                    </div>
                    <div className="w-48">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Original/Asking Price</label>
                      <input
                        type="number"
                        value={property.originalPrice || ''}
                        placeholder="Enter price"
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        onChange={(e) => updatePropertyField(property.id, 'originalPrice', e.target.value)}
                      />
                    </div>
                    <button
                      onClick={() => deleteProperty(property.id)}
                      className="mt-6 p-3 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      title="Delete property"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {['propwire', 'zillow', 'redfin', 'realtor'].map((source) => (
                      <div key={source}>
                        <div className="flex justify-between items-center mb-1">
                          <label className="block text-sm font-medium text-gray-700 capitalize">
                            {source === 'realtor' ? 'Realtor.com' : source}
                          </label>
                          <div className="flex items-center gap-1">
                            <a
                              href={searchLinks[source]}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                              title={`Search on ${source}`}
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                            <button
                              onClick={() => fetchPropertyPrice(property.id, source, property.address)}
                              disabled={!property.address || property.isLoading}
                              className="text-xs text-green-600 hover:text-green-800"
                              title={`Fetch ${source} price`}
                            >
                              <Zap className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <div className="relative">
                          <input
                            type="number"
                            value={property[source] || ''}
                            placeholder="Enter price"
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            onChange={(e) => updatePropertyPrice(property.id, source, e.target.value)}
                          />
                          {property.isLoading && (
                            <div className="absolute right-2 top-2">
                              <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:w-80 space-y-3">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-gray-600" />
                      <span className="font-medium text-gray-700">Calculated Analysis</span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600">
                        Market {calculationMethod === 'average' ? 'Average' : 'Median'}: {formatCurrency(marketValue)}
                      </p>
                      {average && median && (
                        <div className="text-xs text-gray-500 space-y-0.5">
                          <p>Average: {formatCurrency(average)}</p>
                          <p>Median: {formatCurrency(median)}</p>
                        </div>
                      )}
                      <p className={`font-bold ${spread && spread >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        Spread: {spread !== null ? (spread >= 0 ? '+' : '') + formatCurrency(spread) : 'N/A'}
                      </p>
                      <p className={`font-medium ${percentageChange && percentageChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        Change: {formatPercentage(percentageChange)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      <Search className="w-4 h-4" />
                      Quick Search Links:
                    </p>
                    <div className="grid grid-cols-2 gap-1 text-xs">
                      <a href={searchLinks.zillow} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50">
                        <ExternalLink className="w-3 h-3" />
                        Zillow
                      </a>
                      <a href={searchLinks.redfin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50">
                        <ExternalLink className="w-3 h-3" />
                        Redfin
                      </a>
                      <a href={searchLinks.realtor} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50">
                        <ExternalLink className="w-3 h-3" />
                        Realtor
                      </a>
                      <a href={searchLinks.propwire} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50">
                        <ExternalLink className="w-3 h-3" />
                        PropWire
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">How to Use This Calculator</h2>
        <div className="space-y-2 text-gray-600">
          <p>1. <strong>Add properties:</strong> Use the "Add Property" button to create new property entries</p>
          <p>2. <strong>Enter addresses:</strong> Fill in the property address field for each property</p>
          <p>3. <strong>Fetch prices automatically:</strong> Click "Auto-Fetch" to automatically try to get prices from all real estate websites</p>
          <p>4. <strong>Fetch individual prices:</strong> Use the lightning bolt icon next to each platform to fetch just that price</p>
          <p>5. <strong>Manual entry:</strong> If automatic fetching doesn't work, manually enter prices from the search links</p>
          <p>6. <strong>Search online:</strong> Use the "Search Online" button to open all property websites in new tabs</p>
          <p>7. <strong>Copy addresses:</strong> Use the copy button to easily paste addresses into search forms</p>
          <p>8. <strong>View calculations:</strong> The tool automatically calculates market values, spreads, and percentage changes</p>
          <p>9. <strong>Export data:</strong> Use the "Export to CSV" button to download your analysis</p>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">Automatic Price Fetching</h3>
          <div className="text-blue-700 text-sm space-y-2">
            <p>The automatic price fetching feature attempts to get property prices directly from real estate websites.</p>
            <p><strong>Note:</strong> Due to CORS restrictions and website protections, automatic fetching may not always work.</p>
            <p>If automatic fetching fails, the system will open the website in a new tab so you can manually find and enter the price.</p>
            <button
              onClick={() => setShowExtensionInfo(!showExtensionInfo)}
              className="text-blue-600 underline text-xs mt-2"
            >
              {showExtensionInfo ? 'Hide' : 'Show'} browser extension installation instructions
            </button>

            {showExtensionInfo && (
              <div className="mt-3 p-3 bg-white rounded border border-blue-200">
                <h4 className="font-semibold mb-2">CORS Extension Installation</h4>
                <p className="mb-2">For best results with automatic price fetching, install a CORS browser extension:</p>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>Install a CORS extension like "CORS Unblock" or "Moesif Origin & CORS Changer"</li>
                  <li>Enable the extension for this website</li>
                  <li>Refresh the page after enabling the extension</li>
                  <li>Automatic price fetching should work more reliably now</li>
                </ol>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertySpreadCalculator;
