import { Bold, Italic, Strikethrough, Code, AtSign, Paperclip, SendHorizontal, Plus } from "lucide-react";
import { useState, useCallback } from "react";
import EmojiPickerButton from "./EmojiPickerButton";

interface Props {
  channelName: string;
  onSend: (text: string) => void;
}

const MessageInput = ({ channelName, onSend }: Props) => {
  const [text, setText] = useState("");

  const handleSend = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText("");
  }, [text, onSend]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="shrink-0 p-6 pt-2 bg-background">
      <div className="bg-card rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border flex flex-col overflow-hidden">
        <div className="flex items-center gap-0.5 px-3 py-2 border-b bg-muted/30">
          {[Bold, Italic, Strikethrough].map((Icon, i) => (
            <button key={i} className="size-7 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
              <Icon className="size-4" />
            </button>
          ))}
          <div className="w-px h-4 bg-border mx-1" />
          <button className="size-7 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
            <Code className="size-4" />
          </button>
          <button className="size-7 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
            <AtSign className="size-4" />
          </button>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Message ${channelName}...`}
          rows={2}
          className="px-4 py-3 resize-none bg-transparent text-[15px] text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
        />

        <div className="flex justify-between items-center px-3 py-2">
          <div className="flex gap-1 items-center">
            <button className="size-8 rounded-full hover:bg-muted flex items-center justify-center text-muted-foreground"><Plus className="size-5" /></button>
            <button className="size-8 rounded-full hover:bg-muted flex items-center justify-center text-muted-foreground"><Paperclip className="size-4" /></button>
            <EmojiPickerButton
              onSelect={(emoji) => setText((t) => t + emoji)}
              className="size-8 rounded-full hover:bg-muted flex items-center justify-center text-muted-foreground"
              iconClassName="size-4"
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!text.trim()}
            className="px-4 py-1.5 rounded-full bg-primary text-primary-foreground font-medium text-sm shadow-sm hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-40"
          >
            <SendHorizontal className="size-4" />
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;
