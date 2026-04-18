import { useState } from "react";
import { X, Bot, Plus, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export interface MessageRule {
  id: string;
  name: string;
  command: string;
  autoreplyText: string;
  addToTodo: boolean;
}

interface Props {
  open: boolean;
  onClose: () => void;
  rules: MessageRule[];
  onUpdateRules: (rules: MessageRule[]) => void;
}

const RulesPanel = ({ open, onClose, rules, onUpdateRules }: Props) => {
  const [newName, setNewName] = useState("");
  const [newCommand, setNewCommand] = useState("");
  const [newAutoreply, setNewAutoreply] = useState("");
  const [newAddToTodo, setNewAddToTodo] = useState(false);

  if (!open) return null;

  const updateRule = (id: string, patch: Partial<MessageRule>) => {
    onUpdateRules(rules.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  const deleteRule = (id: string) => {
    onUpdateRules(rules.filter((r) => r.id !== id));
  };

  const addRule = () => {
    const trimmedName = newName.trim();
    const trimmedCmd = newCommand.trim();
    const trimmedReply = newAutoreply.trim();
    if (!trimmedName || !trimmedCmd || !trimmedReply) return;
    onUpdateRules([
      ...rules,
      {
        id: `rule-${Date.now()}`,
        name: trimmedName,
        command: trimmedCmd,
        autoreplyText: trimmedReply,
        addToTodo: newAddToTodo,
      },
    ]);
    setNewName("");
    setNewCommand("");
    setNewAutoreply("");
    setNewAddToTodo(false);
  };

  return (
    <div className="w-96 shrink-0 border-l bg-card flex flex-col h-full">
      <div className="h-16 px-5 flex items-center justify-between border-b shrink-0">
        <div className="flex items-center gap-2">
          <Bot className="size-5 text-primary" />
          <h2 className="font-semibold text-lg">Message Rules</h2>
        </div>
        <button
          onClick={onClose}
          className="size-8 rounded-xl hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="size-4" />
        </button>
      </div>

      {/* Scrollable rules list */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {rules.map((rule) => (
          <div key={rule.id} className="p-4 rounded-xl border bg-background flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <input
                value={rule.name}
                onChange={(e) => updateRule(rule.id, { name: e.target.value })}
                className="font-semibold text-sm bg-transparent border-b border-transparent hover:border-border focus:border-primary focus:outline-none transition-colors"
              />
              <button
                onClick={() => deleteRule(rule.id)}
                className="size-7 rounded-lg hover:bg-destructive/10 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">Command</label>
              <div className="flex items-center gap-1">
                <span className="text-sm text-muted-foreground">/</span>
                <input
                  value={rule.command}
                  onChange={(e) => updateRule(rule.id, { command: e.target.value })}
                  className="flex-1 px-2 py-1.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">Autoreply text</label>
              <textarea
                value={rule.autoreplyText}
                onChange={(e) => updateRule(rule.id, { autoreplyText: e.target.value })}
                rows={2}
                className="px-2 py-1.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm text-muted-foreground">Add to to-do list</label>
              <Switch
                checked={rule.addToTodo}
                onCheckedChange={(checked) => updateRule(rule.id, { addToTodo: checked })}
              />
            </div>
          </div>
        ))}

        {/* New rule form */}
        <div className="p-4 rounded-xl border border-dashed bg-muted/20 flex flex-col gap-3">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">New Rule</span>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground">Rule name</label>
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Task rule"
              className="px-2 py-1.5 rounded-lg border bg-background text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground">Command</label>
            <div className="flex items-center gap-1">
              <span className="text-sm text-muted-foreground">/</span>
              <input
                value={newCommand}
                onChange={(e) => setNewCommand(e.target.value)}
                placeholder="e.g. task"
                className="flex-1 px-2 py-1.5 rounded-lg border bg-background text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground">Autoreply text</label>
            <textarea
              value={newAutoreply}
              onChange={(e) => setNewAutoreply(e.target.value)}
              placeholder="e.g. Task was created..."
              rows={2}
              className="px-2 py-1.5 rounded-lg border bg-background text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm text-muted-foreground">Add to to-do list</label>
            <Switch checked={newAddToTodo} onCheckedChange={setNewAddToTodo} />
          </div>

          <button
            onClick={addRule}
            disabled={!newName.trim() || !newCommand.trim() || !newAutoreply.trim()}
            className="mt-1 px-3 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center justify-center gap-1"
          >
            <Plus className="size-4" />
            Add Rule
          </button>
        </div>
      </div>
    </div>
  );
};

export default RulesPanel;
