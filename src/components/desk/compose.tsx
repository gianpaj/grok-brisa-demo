import { useMemo, useState } from "react";
import { channelLabel, localSnippets } from "@/lib/desk/data";
import type { Conversation } from "@/lib/desk/types";

function completeLocal(draft: string, snippets: string[]): string {
  const q = draft.trim();
  const lower = q.toLowerCase();
  const prefix = snippets.find((s) => s.toLowerCase().startsWith(lower));
  if (prefix) return prefix;
  const words = lower.split(/\s+/).filter((w) => w.length > 2);
  const hit = snippets.find((s) => words.some((w) => s.toLowerCase().includes(w)));
  return hit ?? snippets[0] ?? q;
}

export function Compose({
  conversation,
  jumpedIn,
  onSend,
}: {
  conversation: Conversation;
  jumpedIn: boolean;
  onSend: (text: string) => void;
}) {
  const [draft, setDraft] = useState("");
  const [hint, setHint] = useState<string | null>(null);

  const chips = useMemo(
    () => localSnippets(draft, conversation.snippets),
    [draft, conversation.snippets],
  );

  const send = (text: string) => {
    const t = text.trim();
    if (!t) return;
    onSend(t);
    setDraft("");
    setHint(null);
  };

  const complete = () => {
    if (draft.trim().length < 2) return;
    const next = completeLocal(draft, conversation.snippets);
    if (next === draft.trim()) setHint("No fuller line for that.");
    else {
      setDraft(next);
      setHint(null);
    }
  };

  return (
    <div className="border-t border-line bg-surface px-4 py-3 sm:px-6">
      {chips.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {chips.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setDraft(s)}
              className="max-w-full truncate rounded-full bg-sand px-3 py-1.5 text-left text-xs text-fg transition-colors hover:bg-sand/70"
            >
              {s}
            </button>
          ))}
        </div>
      )}
      <div className="flex items-end gap-2">
        <label className="sr-only" htmlFor={`compose-${conversation.id}`}>
          Message
        </label>
        <textarea
          id={`compose-${conversation.id}`}
          rows={2}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send(draft);
            }
            if (e.key === "Tab" && chips[0]) {
              e.preventDefault();
              setDraft(chips[0]);
            }
          }}
          placeholder={
            jumpedIn
              ? `Reply as Clara on ${channelLabel(conversation.channel)}…`
              : "Jump in to reply, or start a draft…"
          }
          className="min-h-11 flex-1 resize-none rounded-xl bg-bg px-3 py-2.5 text-sm leading-relaxed text-fg shadow-[var(--shadow-border)] outline-none placeholder:text-muted focus:shadow-[var(--shadow-border-hover)]"
        />
        <button
          type="button"
          onClick={complete}
          disabled={draft.trim().length < 2}
          className="h-11 shrink-0 rounded-full bg-sand px-3 text-sm font-medium text-fg transition-colors hover:bg-sand/70 disabled:opacity-40 sm:px-4"
        >
          Complete
        </button>
        <button
          type="button"
          onClick={() => send(draft)}
          disabled={!draft.trim()}
          className="h-11 shrink-0 rounded-full bg-primary px-4 text-sm font-medium text-primary-fg disabled:opacity-40"
        >
          Send
        </button>
      </div>
      <p className="mt-2 text-xs text-muted">
        Tab accepts a suggestion. Complete writes the rest of the sentence.
      </p>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}
