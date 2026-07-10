"use client";

import { useState, useMemo } from 'react';
import { MagnifyingGlassIcon, ChevronDownIcon, ChevronUpIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { FAQItem, faqItems } from './faq-data';

export default function FAQScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // Filter FAQs based on search query
  const filteredFAQs = useMemo(() => {
    if (!searchQuery.trim()) return faqItems;

    const query = searchQuery.toLowerCase();
    return faqItems.filter(faq =>
      faq.question.toLowerCase().includes(query) ||
      faq.answer.toLowerCase().includes(query) ||
      faq.category.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Group FAQs by category
  const groupedFAQs = useMemo(() => {
    const grouped: Record<string, FAQItem[]> = {};

    filteredFAQs.forEach(faq => {
      if (!grouped[faq.category]) {
        grouped[faq.category] = [];
      }
      grouped[faq.category].push(faq);
    });

    return grouped;
  }, [filteredFAQs]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setExpandedIndex(null);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const EmptyState = () => (
    <div className="text-center py-16">
      <MagnifyingGlassIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-600 mb-2">No results found</h3>
      <p className="text-gray-500">
        Try searching with different keywords
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className=" px-4 py-4 ">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">FAQ & Help</h1>
          <p className="text-gray-600 mb-2">Get answers to your questions</p>

          {/* Search */}
          <div className=" relative">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search FAQs..."
              className="w-full pl-12 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <XMarkIcon className="w-5 h-5 text-gray-400" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className=" mx-auto px-4 py-8">
        {filteredFAQs.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedFAQs).map(([category, items]) => (
              <div key={category}>
                <div className="flex items-center mb-4">
                  <div className="w-2 h-6 bg-blue-600 rounded-full mr-3"></div>
                  <h2 className="text-xl font-bold text-gray-900">{category}</h2>
                </div>

                <div className="space-y-3">
                  {items.map((faq, index) => {
                    const globalIndex = faqItems.indexOf(faq);
                    const isExpanded = expandedIndex === globalIndex;

                    return (
                      <div key={index} className="bg-white border rounded-lg overflow-hidden">
                        <button
                          onClick={() => toggleExpand(globalIndex)}
                          className="w-full p-4 text-left hover:bg-gray-50 flex justify-between items-start"
                        >
                          <span className={`font-medium text-md ${isExpanded ? 'text-blue-600' : 'text-gray-900'}`}>
                            {faq.question}
                          </span>
                          {isExpanded ? (
                            <ChevronUpIcon className="w-5 h-5 text-blue-600 ml-4 flex-shrink-0" />
                          ) : (
                            <ChevronDownIcon className="w-5 h-5 text-gray-400 ml-4 flex-shrink-0" />
                          )}
                        </button>

                        {isExpanded && (
                          <div className="px-4 pb-4">
                            <div className="pt-3 border-t">
                              <p className="text-gray-600 text-sm whitespace-pre-line leading-relaxed">
                                {faq.answer}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}