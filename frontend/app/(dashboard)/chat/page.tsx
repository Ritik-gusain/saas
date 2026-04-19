'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import MessageInput from '@/components/chat/MessageInput';
import MessageThread from '@/components/chat/MessageThread';
import { useChatStore } from '@/stores/chatStore';

export default function ChatPage() {
  const [teamId, setTeamId] = useState<string | null>(null);
  const { currentConversation, messages, isStreaming, sendMessage, createConversation } = useChatStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch teams via API route (auth header with Firebase token)
        try {
          const token = await user.getIdToken();
          const res = await fetch('/api/teams', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const teams = await res.json();
            if (teams && teams.length > 0) {
              setTeamId(teams[0].id);
            }
          }
        } catch (err) {
          console.error('Failed to fetch team:', err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSendMessage = async (message: string) => {
    if (!currentConversation && teamId) {
      // Create new conversation
      const conv = await createConversation(teamId);
      if (conv) {
        await sendMessage(conv.id, message);
      }
    } else if (currentConversation) {
      await sendMessage(currentConversation.id, message);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 flex flex-col">
        <MessageThread messages={messages} isLoading={isStreaming} />
        <MessageInput onSend={handleSendMessage} disabled={!currentConversation && !teamId} />
      </div>
    </div>
  );
}
