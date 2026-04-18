import { useState, useCallback } from "react";
import { Hash, User, Users } from "lucide-react";
import SlackSidebar from "@/components/SlackSidebar";
import MessageFeed from "@/components/MessageFeed";
import MessageInput from "@/components/MessageInput";
import TodoPanel from "@/components/TodoPanel";
import RulesPanel from "@/components/RulesPanel";
import type { TodoItem } from "@/components/TodoPanel";
import type { MessageRule } from "@/components/RulesPanel";
import {
  sidebarChannels,
  sidebarDMs,
  initialConversations,
  CURRENT_USER,
  type Conversation,
} from "@/data/chatData";

import aiAssistantAvatar from "@/assets/avatar-ai-assistant.png";

const AI_ASSISTANT = {
  name: "AI Assistant",
  avatar: aiAssistantAvatar,
};

const DEFAULT_RULES: MessageRule[] = [
  {
    id: "rule-task",
    name: "Task rule",
    command: "task",
    autoreplyText: "Task was created and added to your todo list.",
    addToTodo: true,
  },
];

function getTimeNow() {
  const d = new Date();
  const h = d.getHours() % 12 || 12;
  const m = d.getMinutes().toString().padStart(2, "0");
  const ampm = d.getHours() >= 12 ? "PM" : "AM";
  return `${h}:${m} ${ampm}`;
}

function getTodayLabel() {
  const d = new Date();
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const day = d.getDate();
  const suffix = day === 1 || day === 21 || day === 31 ? "st" : day === 2 || day === 22 ? "nd" : day === 3 || day === 23 ? "rd" : "th";
  return `${days[d.getDay()]}, ${months[d.getMonth()]} ${day}${suffix}`;
}

// Scan all conversations for /task messages and create initial todos
function extractTasksFromConversations(convs: Record<string, Conversation>): TodoItem[] {
  const tasks: TodoItem[] = [];
  for (const conv of Object.values(convs)) {
    for (const group of conv.dateGroups) {
      for (const msg of group.messages) {
        if (msg.text.includes("/task ")) {
          const taskText = msg.text.substring(msg.text.indexOf("/task ") + 6).trim();
          if (taskText) {
            tasks.push({ id: `task-init-${msg.id}`, text: taskText, author: msg.author, done: false });
          }
        }
      }
    }
  }
  return tasks;
}

const defaultTodos: TodoItem[] = [
  { id: "task-default-1", text: "Review Q2 planning document and add engineering priorities", author: "Mei Tanaka", done: false },
  { id: "task-default-2", text: "Prepare slides for the all-hands presentation", author: "Jasper Lane", done: false },
];

const Index = () => {
  const [activeId, setActiveId] = useState("channel-general");
  const [conversations, setConversations] = useState<Record<string, Conversation>>(initialConversations);
  const [todoOpen, setTodoOpen] = useState(false);
  const [rulesOpen, setRulesOpen] = useState(false);
  const [rules, setRules] = useState<MessageRule[]>(DEFAULT_RULES);
  const [todos, setTodos] = useState<TodoItem[]>(() => [
    ...defaultTodos,
    ...extractTasksFromConversations(initialConversations),
  ]);

  const activeConversation = conversations[activeId];

  const addTodo = useCallback((text: string, author = CURRENT_USER.name) => {
    setTodos((prev) => [
      { id: `task-${Date.now()}-${Math.random()}`, text, author, done: false },
      ...prev,
    ]);
  }, []);

  const toggleTodo = useCallback((id: string) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }, []);

  const addMessageToConversation = useCallback(
    (convId: string, author: string, avatar: string, text: string) => {
      setConversations((prev) => {
        const conv = prev[convId];
        if (!conv) return prev;
        const todayLabel = getTodayLabel();
        const groups = [...conv.dateGroups];
        const lastGroup = groups[groups.length - 1];
        const newMsg = {
          id: `msg-${Date.now()}-${Math.random()}`,
          author,
          avatar,
          time: getTimeNow(),
          text,
        };
        if (lastGroup && lastGroup.label === todayLabel) {
          groups[groups.length - 1] = { ...lastGroup, messages: [...lastGroup.messages, newMsg] };
        } else {
          groups.push({ label: todayLabel, messages: [newMsg] });
        }
        return { ...prev, [convId]: { ...conv, dateGroups: groups } };
      });
    },
    []
  );

  const handleSend = useCallback(
    (text: string) => {
      // Add the user's message
      addMessageToConversation(activeId, CURRENT_USER.name, CURRENT_USER.avatar, text);

      // Check all rules
      for (const rule of rules) {
        const commandTag = `/${rule.command} `;
        if (text.includes(commandTag)) {
          const afterCommand = text.substring(text.indexOf(commandTag) + commandTag.length).trim();

          // Add to todo if rule says so
          if (rule.addToTodo && afterCommand) {
            addTodo(afterCommand, CURRENT_USER.name);
          }

          // Send autoreply
          setTimeout(() => {
            addMessageToConversation(
              activeId,
              AI_ASSISTANT.name,
              AI_ASSISTANT.avatar,
              rule.autoreplyText
            );
          }, 500);
          break; // apply first matching rule only
        }
      }
    },
    [activeId, addMessageToConversation, addTodo, rules]
  );

  const handleAddReaction = useCallback(
    (messageId: string, emoji: string, threadMessageId?: string) => {
      setConversations((prev) => {
        const conv = prev[activeId];
        if (!conv) return prev;
        const updateReactions = (reactions: typeof conv.dateGroups[0]["messages"][0]["reactions"]) => {
          const list = reactions ? [...reactions] : [];
          const existing = list.findIndex((r) => r.label === emoji);
          if (existing >= 0) {
            list[existing] = { ...list[existing], count: list[existing].count + 1 };
          } else {
            const colors = ["yellow", "pink", "green"] as const;
            list.push({ label: emoji, count: 1, color: colors[list.length % 3] });
          }
          return list;
        };
        const groups = conv.dateGroups.map((g) => ({
          ...g,
          messages: g.messages.map((m) => {
            if (m.id !== messageId) return m;
            if (threadMessageId && m.threadMessages) {
              return {
                ...m,
                threadMessages: m.threadMessages.map((tm) =>
                  tm.id === threadMessageId
                    ? { ...tm, reactions: updateReactions(tm.reactions) }
                    : tm
                ),
              };
            }
            return { ...m, reactions: updateReactions(m.reactions) };
          }),
        }));
        return { ...prev, [activeId]: { ...conv, dateGroups: groups } };
      });
    },
    [activeId]
  );

  const handleAddReply = useCallback(
    (messageId: string, text: string) => {
      setConversations((prev) => {
        const conv = prev[activeId];
        if (!conv) return prev;
        const newReply = {
          id: `reply-${Date.now()}-${Math.random()}`,
          author: CURRENT_USER.name,
          avatar: CURRENT_USER.avatar,
          time: getTimeNow(),
          text,
        };
        const groups = conv.dateGroups.map((g) => ({
          ...g,
          messages: g.messages.map((m) =>
            m.id === messageId
              ? { ...m, threadMessages: [...(m.threadMessages ?? []), newReply] }
              : m
          ),
        }));
        return { ...prev, [activeId]: { ...conv, dateGroups: groups } };
      });
    },
    [activeId]
  );

  const displayName = activeConversation
    ? activeConversation.type === "channel"
      ? `#${activeConversation.name}`
      : activeConversation.name
    : "";

  return (
    <div className="flex h-dvh w-full bg-background text-foreground antialiased">
      <SlackSidebar
        channels={sidebarChannels}
        dms={sidebarDMs}
        activeId={activeId}
        onSelect={setActiveId}
        onTodoToggle={() => setTodoOpen((p) => !p)}
        onRulesToggle={() => setRulesOpen((p) => !p)}
      />

      <div className="flex-1 flex flex-col min-w-0 bg-background">
        {/* Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b shrink-0">
          <div className="flex items-center gap-2">
            {activeConversation?.type === "channel" ? (
              <Hash className="size-5 text-muted-foreground" />
            ) : (
              <User className="size-5 text-muted-foreground" />
            )}
            <h2 className="font-semibold text-lg">
              {activeConversation?.type === "channel" ? activeConversation.name : activeConversation?.name}
            </h2>
            {activeConversation?.description && (
              <>
                <span className="text-muted-foreground mx-2">·</span>
                <span className="text-sm text-muted-foreground truncate max-w-[300px]">
                  {activeConversation.description}
                </span>
              </>
            )}
          </div>
          {activeConversation?.memberCount && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
              <Users className="size-4" />
              {activeConversation.memberCount}
            </div>
          )}
        </div>

        {/* Messages */}
        {activeConversation && (
          <MessageFeed
            dateGroups={activeConversation.dateGroups}
            onAddReaction={handleAddReaction}
            onAddReply={handleAddReply}
          />
        )}

        {/* Input */}
        <MessageInput channelName={displayName} onSend={handleSend} />
      </div>

      {/* Todo Panel */}
      <TodoPanel
        open={todoOpen}
        onClose={() => setTodoOpen(false)}
        todos={todos}
        onToggle={toggleTodo}
        onAdd={(text) => addTodo(text)}
      />

      {/* Rules Panel */}
      <RulesPanel
        open={rulesOpen}
        onClose={() => setRulesOpen(false)}
        rules={rules}
        onUpdateRules={setRules}
      />
    </div>
  );
};

export default Index;
