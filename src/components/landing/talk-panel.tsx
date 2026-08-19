import { useEffect, useRef, useState } from "react";
import { Mic, SendHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { WaveState } from "./waveform";

type ChatTurn = { role: "user" | "assistant"; content: string };

type TalkPanelProps = {
  onState: (state: WaveState) => void;
  onClose: () => void;
};

const MAX_TURNS = 6;

/** Lightweight local demo replies — no API key required. */
function localReply(input: string): string {
  const q = input.toLowerCase();
  if (q.includes("pool") || q.includes("spa")) {
    return "The infinity pool is open until ten, and the spa from seven. Shall I note a preference for a quiet floor?";
  }
  if (q.includes("dinner") || q.includes("restaurant") || q.includes("table")) {
    return "I can hold a table at the terrace restaurant. Saturday at eight is still open — shall I book it?";
  }
  if (q.includes("book") || q.includes("reserv") || q.includes("hold")) {
    return "Done. I’ve held the terrace suite for two nights with breakfast. A confirmation is on its way.";
  }
  if (q.includes("price") || q.includes("cost") || q.includes("rate")) {
    return "The west-facing suite is two hundred and forty for the night, breakfast included. Would you like me to hold it?";
  }
  if (q.includes("view") || q.includes("sea") || q.includes("room")) {
    return "Yes — a quiet room with a sea view is free this weekend. Two nights, breakfast included. Shall I hold it?";
  }
  return "Of course. I can check availability, hold a room, or arrange dinner. What would help most?";
}

export function TalkPanel({ onState, onClose }: TalkPanelProps) {
  const [input, setInput] = useState("");
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const [busy, setBusy] = useState(false);
  const [listening, setListening] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const recRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
    return () => {
      recRef.current?.stop();
    };
  }, []);

  const remaining = MAX_TURNS - turns.filter((t) => t.role === "user").length;
  const last = turns.at(-1);

  const send = async (text: string) => {
    const next = text.trim();
    if (!next || busy || remaining <= 0) return;
    setInput("");
    const history: ChatTurn[] = [...turns, { role: "user", content: next }];
    setTurns(history);
    setBusy(true);
    onState("idle");

    await new Promise((r) => setTimeout(r, 600));
    const reply = localReply(next);
    setTurns([...history, { role: "assistant", content: reply }]);
    onState("brisa");
    await new Promise((r) => setTimeout(r, Math.min(4200, reply.split(/\s+/).length * 320)));
    onState("idle");
    setBusy(false);
  };

  const toggleMic = () => {
    const Speech = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!Speech) return;
    if (listening) {
      recRef.current?.stop();
      setListening(false);
      onState("idle");
      return;
    }
    const rec = new Speech();
    rec.lang = "en-US";
    rec.interimResults = true;
    rec.onresult = (event: SpeechRecognitionEvent) => {
      const lastResult = event.results[event.results.length - 1];
      const spoken = lastResult?.[0]?.transcript ?? "";
      setInput(spoken);
      if (lastResult?.isFinal) {
        setListening(false);
        onState("idle");
        void send(spoken);
      }
    };
    rec.onerror = () => {
      setListening(false);
      onState("idle");
    };
    rec.onend = () => {
      setListening(false);
      onState("idle");
    };
    recRef.current = rec;
    rec.start();
    setListening(true);
    onState("listening");
  };

  return (
    <div className="animate-[caption-in_320ms_ease-out]">
      <p className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-muted">
        {listening ? "Listening" : last?.role === "assistant" ? "Brisa" : "You"}
      </p>
      <p className="mt-2 min-h-[3.4rem] font-display text-[1.25rem] leading-snug text-fg italic sm:text-[1.4rem]">
        {last
          ? `“${last.content}”`
          : "Ask about a room, the pool, dinner — as if you just called."}
      </p>

      <form
        className="mt-5 flex items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          void send(input);
        }}
      >
        <div className="flex h-11 flex-1 items-center rounded-full bg-surface px-2 shadow-[var(--shadow-border)]">
          <button
            type="button"
            onClick={toggleMic}
            className={cn(
              "grid size-9 shrink-0 place-items-center rounded-full text-muted transition-colors",
              listening && "bg-primary/10 text-primary",
            )}
            aria-label={listening ? "Stop listening" : "Speak"}
          >
            <Mic className="size-4" strokeWidth={1.75} />
          </button>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type to Brisa"
            disabled={busy || remaining <= 0}
            className="h-11 min-w-0 flex-1 bg-transparent px-2 text-sm text-fg outline-none placeholder:text-muted"
          />
        </div>
        <Button
          type="submit"
          size="icon"
          disabled={busy || !input.trim() || remaining <= 0}
          aria-label="Send"
        >
          <SendHorizontal className="size-4" strokeWidth={1.75} />
        </Button>
      </form>

      <p className="mt-3 text-xs text-muted">
        {remaining <= 0
          ? "Demo limit reached — "
          : busy
            ? "Brisa is answering…"
            : `${remaining} turn${remaining === 1 ? "" : "s"} left in this preview.`}
        {remaining <= 0 ? (
          <button type="button" className="underline underline-offset-2" onClick={onClose}>
            close
          </button>
        ) : null}
      </p>
    </div>
  );
}

type SpeechRecognition = {
  lang: string;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
};

type SpeechRecognitionEvent = {
  results: ArrayLike<{ isFinal: boolean; 0?: { transcript: string } }>;
};

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
  }
}
