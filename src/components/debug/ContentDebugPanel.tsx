'use client';

import { useState } from 'react';
import { contentStorage } from '@/lib/content/storage';
import { Database, RefreshCw, Trash2, Download, Upload } from 'lucide-react';

export function ContentDebugPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [allContents, setAllContents] = useState<any[]>([]);

  const refreshContents = () => {
    const contents = contentStorage.getAllContents();
    setAllContents(contents);
    console.log('📊 All contents:', contents);
  };

  const clearAllContents = () => {
    if (window.confirm('Are you sure you want to clear ALL content? This cannot be undone!')) {
      contentStorage.clearAllContents();
      setAllContents([]);
      alert('All content cleared!');
    }
  };

  const initializeSampleContents = () => {
    contentStorage.initializeSampleContents();
    refreshContents();
    alert('Sample contents initialized!');
  };

  const exportContents = () => {
    const data = contentStorage.exportContents();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'creator-vault-contents.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => {
          setIsOpen(true);
          refreshContents();
        }}
        className="fixed bottom-4 left-4 z-50 bg-gray-800 text-white p-3 rounded-full hover:bg-gray-700 transition-colors shadow-lg"
        title="Content Debug Panel"
      >
        <Database className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-4 max-w-md max-h-96 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Content Debug Panel</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
      </div>

      <div className="space-y-3 mb-4">
        <button
          onClick={refreshContents}
          className="w-full flex items-center space-x-2 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh ({allContents.length})</span>
        </button>

        <button
          onClick={initializeSampleContents}
          className="w-full flex items-center space-x-2 bg-green-600 text-white py-2 px-3 rounded text-sm hover:bg-green-700 transition-colors"
        >
          <Upload className="w-4 h-4" />
          <span>Add Sample Content</span>
        </button>

        <button
          onClick={exportContents}
          className="w-full flex items-center space-x-2 bg-purple-600 text-white py-2 px-3 rounded text-sm hover:bg-purple-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Export Content</span>
        </button>

        <button
          onClick={clearAllContents}
          className="w-full flex items-center space-x-2 bg-red-600 text-white py-2 px-3 rounded text-sm hover:bg-red-700 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          <span>Clear All</span>
        </button>
      </div>

      <div className="text-xs text-gray-600 space-y-1">
        <p><strong>Total:</strong> {allContents.length}</p>
        <p><strong>Published:</strong> {allContents.filter(c => c.status === 'published').length}</p>
        <p><strong>Premium:</strong> {allContents.filter(c => c.isPremium).length}</p>
        <p><strong>Creators:</strong> {[...new Set(allContents.map(c => c.creatorName))].length}</p>
      </div>

      {allContents.length > 0 && (
        <div className="mt-4 space-y-2 max-h-40 overflow-y-auto">
          <div className="text-xs font-medium text-gray-700">Recent Content:</div>
          {allContents.slice(0, 3).map(content => (
            <div key={content.id} className="text-xs bg-gray-50 p-2 rounded">
              <div className="font-medium truncate">{content.title}</div>
              <div className="text-gray-500">by {content.creatorName}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
