import { Hash, ChevronDown, Plus, MessageSquare, ListTodo, Bot } from "lucide-react";
import type { SidebarChannel, SidebarDM } from "@/data/chatData";

interface Props {
  channels: SidebarChannel[];
  dms: SidebarDM[];
  activeId: string;
  onSelect: (id: string) => void;
  onTodoToggle: () => void;
  onRulesToggle: () => void;
}

const SlackSidebar = ({ channels, dms, activeId, onSelect, onTodoToggle, onRulesToggle }: Props) => {
  return (
    <div className="w-64 shrink-0 bg-sidebar-bg flex flex-col text-sidebar-fg">
      <div className="h-16 px-5 flex items-center border-b border-sidebar-border hover:bg-sidebar-active transition-colors cursor-pointer">
        <h1 className="font-semibold text-lg tracking-tight">Slack Clone PH</h1>
        <ChevronDown className="ml-auto size-4 opacity-50" />
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-6">
        <div className="flex flex-col gap-0.5">
          <button className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-sidebar-item-hover text-sidebar-muted-text hover:text-sidebar-fg font-medium text-sm transition-colors">
            <MessageSquare className="size-4 opacity-60" />
            Threads
          </button>
        </div>

        <div className="flex flex-col gap-1">
          <div className="px-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-sidebar-muted-text tracking-wider uppercase">Channels</span>
            <Plus className="size-3.5 text-sidebar-muted-text hover:text-sidebar-fg cursor-pointer transition-colors" />
          </div>
          {channels.map((ch) => {
            const id = `channel-${ch.name}`;
            return (
              <button
                key={ch.name}
                onClick={() => onSelect(id)}
                className={`flex items-center gap-2 px-2 py-1.5 rounded-xl font-medium text-sm transition-colors ${
                  activeId === id
                    ? "bg-sidebar-active text-sidebar-fg"
                    : "text-sidebar-muted-text hover:bg-sidebar-item-hover hover:text-sidebar-fg"
                }`}
              >
                <Hash className="size-4 opacity-50 shrink-0" />
                <span className="truncate">{ch.name}</span>
                {ch.unread && ch.unread > 0 && (
                  <span className="ml-auto bg-sticky-pink text-foreground text-xs font-bold px-1.5 py-0.5 rounded-full leading-none">
                    {ch.unread}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-1">
          <div className="px-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-sidebar-muted-text tracking-wider uppercase">Direct Messages</span>
            <Plus className="size-3.5 text-sidebar-muted-text hover:text-sidebar-fg cursor-pointer transition-colors" />
          </div>
          {dms.map((dm) => (
            <button
              key={dm.id}
              onClick={() => onSelect(dm.id)}
              className={`flex items-center gap-2 px-2 py-1.5 rounded-xl transition-colors ${
                activeId === dm.id
                  ? "bg-sidebar-active text-sidebar-fg"
                  : "text-sidebar-muted-text hover:bg-sidebar-item-hover hover:text-sidebar-fg"
              }`}
            >
              <div className="relative shrink-0">
                <div className="size-5 rounded-full bg-muted overflow-hidden">
                  <img src={dm.avatar} loading="lazy" className="w-full h-full object-cover" alt={dm.name} width={40} height={40} />
                </div>
                {dm.online && (
                  <div className="absolute -bottom-0.5 -right-0.5 size-2 rounded-full bg-sticky-green border-2 border-sidebar-bg" />
                )}
              </div>
              <span className="font-medium text-sm truncate">{dm.name}</span>
            </button>
          ))}
        </div>

        {/* To-do list & AI Assistant buttons */}
        <div className="flex flex-col gap-2 pt-2 border-t border-sidebar-border">
          <button
            onClick={onTodoToggle}
            className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-sidebar-item-hover text-sidebar-muted-text hover:text-sidebar-fg font-medium text-sm transition-colors border border-sidebar-border"
          >
            <ListTodo className="size-4 opacity-60" />
            To-do list
          </button>
          <button
            onClick={onRulesToggle}
            className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-sidebar-item-hover text-sidebar-muted-text hover:text-sidebar-fg font-medium text-sm transition-colors border border-sidebar-border"
          >
            <Bot className="size-4 opacity-60" />
            AI Assistant
          </button>
        </div>
      </div>
    </div>
  );
};

export default SlackSidebar;
