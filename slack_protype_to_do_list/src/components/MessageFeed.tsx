import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronRight, Reply, SendHorizontal } from "lucide-react";
import type { DateGroup, ChatMessage, ThreadMessage } from "@/data/chatData";
import EmojiPickerButton from "./EmojiPickerButton";

interface Props {
  dateGroups: DateGroup[];
  onAddReaction: (messageId: string, emoji: string, threadMessageId?: string) => void;
  onAddReply: (messageId: string, text: string) => void;
}

const reactionColors = {
  yellow: "bg-sticky-yellow/40 border-sticky-yellow/60 hover:bg-sticky-yellow/60",
  pink: "bg-sticky-pink/40 border-sticky-pink/60 hover:bg-sticky-pink/60",
  green: "bg-sticky-green/40 border-sticky-green/60 hover:bg-sticky-green/60",
};

const MessageFeed = ({ dateGroups, onAddReaction, onAddReply }: Props) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [dateGroups]);

  return (
    <div className="flex-1 overflow-y-auto p-6 pb-0 flex flex-col gap-6">
      {dateGroups.map((group) => (
        <div key={group.label} className="flex flex-col gap-5">
          <div className="flex items-center gap-4 py-2">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs font-semibold text-muted-foreground bg-background px-3 py-1 rounded-full border">
              {group.label}
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {group.messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              msg={msg}
              onAddReaction={onAddReaction}
              onAddReply={onAddReply}
            />
          ))}
        </div>
      ))}
      <div ref={bottomRef} className="h-4 shrink-0" />
    </div>
  );
};

interface BubbleProps {
  msg: ChatMessage;
  onAddReaction: (messageId: string, emoji: string, threadMessageId?: string) => void;
  onAddReply: (messageId: string, text: string) => void;
}

const MessageBubble = ({ msg, onAddReaction, onAddReply }: BubbleProps) => {
  const hasThread = msg.threadMessages && msg.threadMessages.length > 0;
  const [threadOpen, setThreadOpen] = useState(false);
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState("");

  const submitReply = () => {
    const trimmed = replyText.trim();
    if (!trimmed) return;
    onAddReply(msg.id, trimmed);
    setReplyText("");
    setThreadOpen(true);
  };

  return (
    <div className="flex gap-4 group hover:bg-muted/30 -mx-4 px-4 py-2 rounded-2xl transition-colors">
      <div className="size-10 rounded-2xl bg-muted overflow-hidden shrink-0 shadow-sm">
        <img src={msg.avatar} loading="lazy" className="w-full h-full object-cover" alt={msg.author} width={80} height={80} />
      </div>
      <div className="flex flex-col gap-1 min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="font-semibold text-foreground">{msg.author}</span>
          <span className="text-xs text-muted-foreground">{msg.time}</span>
        </div>
        <div className="text-[15px] leading-relaxed max-w-[65ch] text-foreground/90 whitespace-pre-line">
          {msg.text}
        </div>

        <div className="flex gap-2 mt-2 items-center flex-wrap">
          {msg.reactions?.map((r, i) => (
            <button
              key={`r-${i}`}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-sm font-medium text-foreground transition-colors ${reactionColors[r.color]}`}
            >
              <span>{r.label}</span>
              <span className="opacity-70">{r.count}</span>
            </button>
          ))}
          <EmojiPickerButton
            onSelect={(emoji) => onAddReaction(msg.id, emoji)}
          />
          <button
            onClick={() => setReplyOpen((p) => !p)}
            className="size-7 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Reply"
          >
            <Reply className="size-4" />
          </button>
        </div>

        {hasThread && (
          <button
            onClick={() => setThreadOpen((p) => !p)}
            className="mt-2 flex items-center gap-3 text-left rounded-lg hover:bg-muted/40 px-2 py-1 -ml-2 w-fit"
          >
            <div className="flex -space-x-1.5">
              {msg.threadMessages!.slice(0, 3).map((tm, i) => (
                <div key={i} className="size-6 rounded-full bg-muted overflow-hidden border-2 border-background">
                  <img src={tm.avatar} loading="lazy" className="w-full h-full object-cover" alt={tm.author} width={40} height={40} />
                </div>
              ))}
            </div>
            <span className="text-sm font-medium text-primary">
              {msg.threadMessages!.length} {msg.threadMessages!.length === 1 ? "reply" : "replies"}
            </span>
            {threadOpen ? <ChevronDown className="size-4 text-muted-foreground" /> : <ChevronRight className="size-4 text-muted-foreground" />}
          </button>
        )}

        {hasThread && threadOpen && (
          <div className="ml-4 mt-2 border-l-2 border-muted pl-4 flex flex-col gap-3">
            {msg.threadMessages!.map((tm) => (
              <ThreadBubble
                key={tm.id}
                parentId={msg.id}
                tm={tm}
                onAddReaction={onAddReaction}
              />
            ))}
          </div>
        )}

        {replyOpen && (
          <div className="mt-3 ml-0 flex items-center gap-2 bg-card border rounded-2xl px-3 py-2 shadow-sm">
            <input
              autoFocus
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submitReply();
                }
              }}
              placeholder="Reply in thread..."
              className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-muted-foreground/60"
            />
            <EmojiPickerButton onSelect={(emoji) => setReplyText((t) => t + emoji)} />
            <button
              onClick={submitReply}
              disabled={!replyText.trim()}
              className="size-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-40 hover:opacity-90 transition-opacity"
              aria-label="Send reply"
            >
              <SendHorizontal className="size-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const ThreadBubble = ({
  parentId,
  tm,
  onAddReaction,
}: {
  parentId: string;
  tm: ThreadMessage;
  onAddReaction: (messageId: string, emoji: string, threadMessageId?: string) => void;
}) => {
  return (
    <div className="flex gap-3 group/thread">
      <div className="size-7 rounded-full bg-muted overflow-hidden shrink-0">
        <img src={tm.avatar} loading="lazy" className="w-full h-full object-cover" alt={tm.author} width={40} height={40} />
      </div>
      <div className="flex flex-col gap-0.5 min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="font-semibold text-sm text-foreground">{tm.author}</span>
          <span className="text-[11px] text-muted-foreground">{tm.time}</span>
        </div>
        <p className="text-sm leading-relaxed text-foreground/85 whitespace-pre-line">{tm.text}</p>
        <div className="flex gap-2 mt-1 items-center flex-wrap">
          {tm.reactions?.map((r, i) => (
            <span
              key={i}
              className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg border text-xs font-medium text-foreground ${reactionColors[r.color]}`}
            >
              <span>{r.label}</span>
              <span className="opacity-70">{r.count}</span>
            </span>
          ))}
          <EmojiPickerButton
            onSelect={(emoji) => onAddReaction(parentId, emoji, tm.id)}
            className="size-6 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors opacity-0 group-hover/thread:opacity-100"
            iconClassName="size-3.5"
          />
        </div>
      </div>
    </div>
  );
};

export default MessageFeed;
