import { useMemo, useState } from "react";
import { channelLabel, langName, localSnippets, localTranslate } from "@/lib/desk/data";
import type { Conversation, Guest } from "@/lib/desk/types";
import { ChannelIcon } from "./inbox";

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
  guest,
  agentOn,
  onSend,
}: {
  conversation: Conversation;
  guest: Guest;
  agentOn: boolean;
  onSend: (text: string, textEn?: string) => void;
}) {
  const [draft, setDraft] = useState("");
  const [englishSource, setEnglishSource] = useState("");
  const [translated, setTranslated] = useState(false);
  const [hint, setHint] = useState<string | null>(null);

  const needsTranslate = conversation.lang !== "en";

  const chips = useMemo(
    () => localSnippets(translated ? englishSource : draft, conversation.snippets),
    [draft, englishSource, translated, conversation.snippets],
  );

  const applyDraft = (text: string) => {
    setDraft(text);
    setEnglishSource(text);
    setTranslated(false);
    setHint(null);
  };

  const send = (text: string) => {
    const t = text.trim();
    if (!t) return;
    const textEn =
      needsTranslate && translated && englishSource.trim()
        ? englishSource.trim()
        : needsTranslate
          ? t
          : undefined;
    onSend(t, textEn);
    setDraft("");
    setEnglishSource("");
    setTranslated(false);
    setHint(null);
  };

  const complete = () => {
    if (draft.trim().length < 2) return;
    const source = translated ? englishSource || draft : draft;
    const next = completeLocal(source, conversation.snippets);
    if (next === source.trim()) setHint("No fuller line for that.");
    else applyDraft(next);
  };

  const translate = () => {
    if (draft.trim().length < 2 || !needsTranslate) return;
    const source = (translated ? englishSource : draft).trim();
    if (!source) return;
    const local = localTranslate(source, conversation.lang);
    if (local) {
      setEnglishSource(source);
      setDraft(local);
      setTranslated(true);
      setHint(null);
      return;
    }
    setHint("No house line for that — try a suggestion, or keep English.");
  };

  return (
    <div className="border-t border-line bg-surface px-4 py-3 sm:px-6">
      {chips.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {chips.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => applyDraft(s)}
              className="max-w-full truncate rounded-full bg-sand px-3 py-1.5 text-left text-xs text-fg transition-colors hover:bg-sand/70"
            >
              {s}
            </button>
          ))}
        </div>
      )}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
        <label className="sr-only" htmlFor={`compose-${conversation.id}`}>
          Message
        </label>
        <textarea
          id={`compose-${conversation.id}`}
          rows={2}
          value={draft}
          onChange={(e) => applyDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send(draft);
            }
            if (e.key === "Tab" && chips[0]) {
              e.preventDefault();
              applyDraft(chips[0]);
            }
          }}
          placeholder={
            agentOn
              ? `Turn agent off to reply as Clara on ${channelLabel(conversation.channel)}…`
              : needsTranslate
                ? `Reply in English, then Translate to ${langName(conversation.lang)}…`
                : `Reply to ${guest.name.split(" ")[0]} on ${channelLabel(conversation.channel)}…`
          }
          className="min-h-11 w-full flex-1 resize-none rounded-xl bg-bg px-3 py-2.5 text-sm leading-relaxed text-fg shadow-[var(--shadow-border)] outline-none placeholder:text-muted focus:shadow-[var(--shadow-border-hover)]"
        />
        <div className="flex shrink-0 gap-2">
          {needsTranslate && (
            <button
              type="button"
              onClick={translate}
              disabled={draft.trim().length < 2}
              className="h-11 shrink-0 rounded-full bg-sand px-3 text-sm font-medium text-fg transition-colors hover:bg-sand/70 disabled:opacity-40 sm:px-4"
            >
              {translated ? "Translated" : "Translate"}
            </button>
          )}
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
      </div>
      <div className="mt-2 flex items-center gap-2 text-xs text-muted">
        <ChannelIcon channel={conversation.channel} />
        <span>{channelLabel(conversation.channel)}</span>
        {needsTranslate && (
          <>
            <span aria-hidden="true">·</span>
            <span>{langName(conversation.lang)}</span>
          </>
        )}
        <span aria-hidden="true">·</span>
        <span>Tab accepts a suggestion</span>
      </div>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}
