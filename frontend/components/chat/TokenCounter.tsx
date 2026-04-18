'use client';

interface TokenCounterProps {
  used: number;
  limit?: number;
}

export default function TokenCounter({ used, limit }: TokenCounterProps) {
  const percentage = limit ? (used / limit) * 100 : 0;

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-gray-700">Tokens: {used}</span>
      {limit && (
        <>
          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${
                percentage > 90
                  ? 'bg-red-500'
                  : percentage > 70
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
          <span className="text-xs text-gray-500">{limit}</span>
        </>
      )}
    </div>
  );
}
