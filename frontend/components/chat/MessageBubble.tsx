'use client';

interface MessageBubbleProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
  model?: string;
  onCopy?: () => void;
  onRegenerate?: () => void;
}

export default function MessageBubble({
  role,
  content,
  timestamp,
  model,
  onCopy,
  onRegenerate,
}: MessageBubbleProps) {
  const isUser = role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-md lg:max-w-xl px-4 py-2 rounded-lg ${
          isUser
            ? 'bg-blue-600 text-white rounded-br-none'
            : 'bg-gray-200 text-gray-900 rounded-bl-none'
        }`}
      >
        <p className="text-sm">{content}</p>
        
        <div className="flex items-center justify-between mt-2 text-xs gap-2">
          {model && <span className="opacity-70">{model}</span>}
          {timestamp && <span className="opacity-70">{timestamp}</span>}
          
          {!isUser && (
            <div className="flex gap-1">
              <button
                onClick={onCopy}
                className="hover:opacity-70 transition"
                title="Copy"
              >
                📋
              </button>
              <button
                onClick={onRegenerate}
                className="hover:opacity-70 transition"
                title="Regenerate"
              >
                🔄
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
