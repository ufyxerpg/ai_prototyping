import { useState, useRef, useEffect } from "react";
import { SmilePlus } from "lucide-react";
import EmojiPicker, { EmojiStyle, Theme } from "emoji-picker-react";

interface Props {
  onSelect: (emoji: string) => void;
  className?: string;
  iconClassName?: string;
}

const EmojiPickerButton = ({ onSelect, className, iconClassName }: Props) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className={
          className ??
          "size-7 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        }
        aria-label="Add emoji"
      >
        <SmilePlus className={iconClassName ?? "size-4"} />
      </button>
      {open && (
        <div className="absolute bottom-full right-0 mb-2 z-50 shadow-xl rounded-xl overflow-hidden">
          <EmojiPicker
            onEmojiClick={(data) => {
              onSelect(data.emoji);
              setOpen(false);
            }}
            emojiStyle={EmojiStyle.NATIVE}
            theme={Theme.LIGHT}
            width={320}
            height={380}
            searchDisabled={false}
            skinTonesDisabled
            previewConfig={{ showPreview: false }}
          />
        </div>
      )}
    </div>
  );
};

export default EmojiPickerButton;
