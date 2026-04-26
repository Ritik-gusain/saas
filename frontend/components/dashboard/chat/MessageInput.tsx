'use client';

import { useState, useRef } from 'react';

interface MessageInputProps {
  onSend: (message: string) => Promise<void>;
  disabled?: boolean;
}

export default function MessageInput({ onSend, disabled = false }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = async () => {
    if (!message.trim() || isLoading || disabled) return;

    setIsLoading(true);
    try {
      await onSend(message);
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    } catch (error) {
      console.error('Send error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white p-4 space-y-3">
      <textarea
        ref={textareaRef}
        value={message}
        onChange={handleTextChange}
        onKeyDown={handleKeyDown}
        placeholder="Type your message... (Shift+Enter for new line)"
        disabled={isLoading || disabled}
        rows={1}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none disabled:opacity-50"
        style={{ minHeight: '44px' }}
      />

      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button
            type="button"
            className="p-2 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
            disabled={isLoading || disabled}
            title="Attach file"
          >
            📎
          </button>
          <button
            type="button"
            className="p-2 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
            disabled={isLoading || disabled}
            title="Generate image"
          >
            🖼️
          </button>
        </div>

        <button
          onClick={handleSend}
          disabled={isLoading || disabled || !message.trim()}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition font-medium"
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
}
