import React from 'react';

const AiLoadingIndicator = () => {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
      <div className="relative w-20 h-20">
        <div className="ai-loader-ring"></div>
        <div className="ai-loader-core">
          <div className="ai-loader-orb"></div>
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-gray-700">Our AI is thinking...</p>
        <p className="text-xs text-gray-500">This can take a few moments while we craft tailored suggestions.</p>
      </div>
    </div>
  );
};

export default AiLoadingIndicator;
