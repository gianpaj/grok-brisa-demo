import { useEffect, useRef } from "react";
import { Check, LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { channelLabel, HOUSE } from "@/lib/desk/data";
import type { Actor, AiAction, Conversation, Guest, Message } from "@/lib/desk/types";
import { ChannelIcon } from "./inbox";
import { Compose } from "./compose";

function clock(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function actorLabel(actor: Actor): string {
  if (actor === "guest") return "Guest";
  if (actor === "brisa") return "Brisa";
  return HOUSE.desk;
}

export function Thread({
  conversation,
  guest,
  jumpedIn,
  onJump,
  onSend,
  onConfirmAction,
}: {
  conversation: Conversation;
  guest: Guest;
  jumpedIn: boolean;
  onJump: () => void;
  onSend: (text: string) => void;
  onConfirmAction: (actionId: string) => void;
}) {
  const events = interleave(conversation.messages, conversation.actions);
  const bottomRef = useRef<HTMLDivElement>(null);
  const lastGuestOrHold =
    conversation.messages.at(-1)?.text.includes("one moment") ?? false;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [events.length, conversation.id]);

  return (
    <div className="flex h-full min-h-0 flex-col bg-bg">
      <header className="flex items-center justify-between gap-3 border-b border-line px-4 py-3 sm:px-6">
        <div className="min-w-0">
          <p className="truncate font-medium">{guest.name}</p>
          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted">
            <ChannelIcon channel={conversation.channel} />
            <span>{channelLabel(conversation.channel)}</span>
            {conversation.status === "live" ? (
              <>
                <span aria-hidden="true">·</span>
                <span className="live-bars text-primary" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </span>
                <span>live with Brisa</span>
              </>
            ) : null}
          </p>
        </div>
        <button
          type="button"
          onClick={onJump}
          className={cn(
            "h-11 shrink-0 rounded-full px-4 text-sm font-medium transition-colors",
            jumpedIn
              ? "bg-sand text-fg"
              : "bg-primary text-primary-fg shadow-[var(--shadow-border)] hover:bg-primary/90",
          )}
        >
          {jumpedIn ? "You’re in" : "Jump in"}
        </button>
      </header>

      {jumpedIn && (
        <p className="border-b border-line bg-sand/60 px-4 py-2 text-xs text-muted sm:px-6">
          Brisa is listening. Replies go out as {HOUSE.desk} at the desk.
        </p>
      )}

      <div className="desk-scroll min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6">
        <ol className="mx-auto flex max-w-xl flex-col gap-4">
          {events.map((ev) =>
            ev.kind === "action" ? (
              <ActionCard
                key={ev.action.id}
                action={ev.action}
                onConfirm={() => onConfirmAction(ev.action.id)}
              />
            ) : (
              <Bubble key={ev.message.id} message={ev.message} />
            ),
          )}
          {conversation.status === "live" && !jumpedIn && lastGuestOrHold && (
            <li className="flex items-center gap-2 pl-1 text-xs text-muted">
              <LoaderCircle className="size-3.5 animate-spin" strokeWidth={1.75} />
              Brisa is fetching a room…
            </li>
          )}
          <li aria-hidden="true">
            <div ref={bottomRef} />
          </li>
        </ol>
      </div>

      <Compose
        key={conversation.id}
        conversation={conversation}
        jumpedIn={jumpedIn}
        onSend={onSend}
      />
    </div>
  );
}

function Bubble({ message }: { message: Message }) {
  const mine = message.actor !== "guest";
  return (
    <li className={cn("flex flex-col gap-1", mine ? "items-end" : "items-start")}>
      <span className="px-1 text-[0.7rem] font-medium uppercase tracking-[0.16em] text-muted">
        {actorLabel(message.actor)}
        <span className="ml-2 font-sans font-normal normal-case tracking-normal tabular-nums">
          {clock(message.at)}
        </span>
      </span>
      <p
        className={cn(
          "max-w-[min(100%,28rem)] rounded-2xl px-3.5 py-2.5 text-[0.95rem] leading-relaxed",
          message.actor === "guest" && "rounded-tl-md bg-surface text-fg shadow-[var(--shadow-border)]",
          message.actor === "brisa" && "rounded-tr-md bg-sand text-fg",
          message.actor === "desk" && "rounded-tr-md bg-primary text-primary-fg",
        )}
      >
        {message.text}
      </p>
    </li>
  );
}

function ActionCard({
  action,
  onConfirm,
}: {
  action: AiAction;
  onConfirm: () => void;
}) {
  return (
    <li className="rounded-xl bg-surface px-3.5 py-3 shadow-[var(--shadow-border)]">
      <div className="flex items-start gap-2.5">
        <span
          className={cn(
            "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full",
            action.status === "done" ? "bg-primary/15 text-primary" : "bg-sand text-muted",
          )}
        >
          {action.status === "done" ? (
            <Check className="size-3.5" strokeWidth={2} />
          ) : (
            <LoaderCircle className="size-3.5 animate-spin" strokeWidth={1.75} />
          )}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">{action.label}</p>
          <p className="mt-0.5 text-xs leading-relaxed text-muted">{action.detail}</p>
        </div>
        {action.status === "pending" && (
          <button
            type="button"
            onClick={onConfirm}
            className="h-9 shrink-0 rounded-full bg-primary px-3 text-xs font-medium text-primary-fg"
          >
            Confirm
          </button>
        )}
      </div>
    </li>
  );
}

type Event =
  | { kind: "message"; at: string; message: Message }
  | { kind: "action"; at: string; action: AiAction };

function interleave(messages: Message[], actions: AiAction[]): Event[] {
  const events: Event[] = [
    ...messages.map((message) => ({ kind: "message" as const, at: message.at, message })),
    ...actions.map((action) => ({ kind: "action" as const, at: action.at, action })),
  ];
  events.sort((a, b) => a.at.localeCompare(b.at));
  return events;
}
