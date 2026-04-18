'use client';

import { useSupabase } from '@/components/providers/SupabaseProvider';
import { useEffect, useState } from 'react';
import MessageInput from '@/components/chat/MessageInput';
import MessageThread from '@/components/chat/MessageThread';
import { useChatStore } from '@/stores/chatStore';

export default function ChatPage() {
  const supabase = useSupabase();
  const [teamId, setTeamId] = useState<string | null>(null);
  const { currentConversation, messages, isStreaming, sendMessage, createConversation } = useChatStore();

  useEffect(() => {
    // Get current team
    const fetchTeam = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: teams } = await supabase
          .from('teams')
          .select('id')
          .eq('owner_id', user.id)
          .single();

        if (teams) {
          setTeamId(teams.id);
        }
      }
    };

    fetchTeam();
  }, [supabase]);

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
