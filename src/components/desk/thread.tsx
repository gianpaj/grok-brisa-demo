import { useEffect, useRef } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  channelLabel,
  HOUSE,
  stayLine,
  DESK_NOW,
  waitLabel,
  waitMinutes,
  GAP_MINUTES,
  clockLabel,
  langName,
  messageDisplay,
} from "@/lib/desk/data";
import type {
  Actor,
  AiAction,
  Conversation,
  Guest,
  Message,
} from "@/lib/desk/types";
import { ChannelIcon } from "./inbox";
import { Compose } from "./compose";

function clock(iso: string): string {
  return clockLabel(iso);
}

function actorLabel(actor: Actor): string {
  if (actor === "guest") return "Guest";
  if (actor === "brisa") return "Brisa";
  return HOUSE.desk;
}

export function Thread({
  conversation,
  guest,
  channels,
  agentOn,
  onToggleAgent,
  onSelectChannel,
  onSend,
  onConfirmAction,
  showTranslation,
}: {
  conversation: Conversation;
  guest: Guest;
  channels: Conversation[];
  agentOn: boolean;
  onToggleAgent: () => void;
  onSelectChannel: (id: string) => void;
  onSend: (text: string, textEn?: string) => void;
  onConfirmAction: (actionId: string) => void;
  showTranslation: boolean;
}) {
  const events = interleave(conversation.messages, conversation.actions);
  const bottomRef = useRef<HTMLDivElement>(null);
  const last = conversation.messages.at(-1);
  const lastGuestOrHold = Boolean(
    last &&
      (last.text.includes("un instant") ||
        last.text.includes("one moment") ||
        last.textEn?.includes("one moment")),
  );
  const extras = guest.booking?.extras ?? [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [events.length, conversation.id]);

  return (
    <div className="flex h-full min-h-0 flex-col bg-bg">
      <header className="flex flex-col gap-3 border-b border-line px-4 py-3 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate font-medium">{guest.name}</p>
            <p className="mt-0.5 truncate text-xs text-muted">
              {stayLine(guest)}
              {conversation.lang !== "en" ? ` · ${langName(conversation.lang)}` : ""}
            </p>
          </div>
          <button
            type="button"
            onClick={onToggleAgent}
            className={cn(
              "h-11 shrink-0 rounded-full px-4 text-sm font-medium transition-colors",
              agentOn
                ? "bg-primary text-primary-fg shadow-[var(--shadow-border)]"
                : "bg-sand text-fg",
            )}
            aria-pressed={agentOn}
          >
            {agentOn ? "Agent on" : "Agent off"}
          </button>
        </div>
        {channels.length > 1 && (
          <div className="flex flex-wrap gap-1.5">
            {channels.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => onSelectChannel(c.id)}
                className={cn(
                  "inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-medium",
                  c.id === conversation.id ? "bg-fg text-bg" : "bg-sand text-fg",
                )}
              >
                <ChannelIcon channel={c.channel} />
                {channelLabel(c.channel)}
              </button>
            ))}
          </div>
        )}
      </header>

      {agentOn ? (
        <p className="border-b border-line bg-sand/60 px-4 py-2 text-xs text-muted sm:px-6">
          {conversation.status === "live" ? (
            <span className="inline-flex items-center gap-1.5">
              <span className="live-bars text-primary" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
              Brisa is on the line. Turn agent off to take over as {HOUSE.desk}.
            </span>
          ) : (
            <>
              Agent mode — Brisa is handling this {channelLabel(conversation.channel)}{" "}
              thread. Turn it off to reply as {HOUSE.desk}.
            </>
          )}
        </p>
      ) : conversation.status === "needs_you" ? (
        <p className="border-b border-line bg-sand/60 px-4 py-2 text-xs text-muted sm:px-6">
          Brisa asked for you. Replies go out as {HOUSE.desk} on{" "}
          {channelLabel(conversation.channel)}.
        </p>
      ) : (
        <p className="border-b border-line bg-sand/60 px-4 py-2 text-xs text-muted sm:px-6">
          You’re on this thread as {HOUSE.desk}.
        </p>
      )}

      {extras.length > 0 && (
        <ul className="flex gap-2 overflow-x-auto border-b border-line px-4 py-3 sm:px-6">
          {extras.map((extra) => (
            <li
              key={extra}
              className="min-w-40 shrink-0 rounded-xl bg-surface px-3 py-2 shadow-[var(--shadow-border)]"
            >
              <p className="text-[0.7rem] font-medium uppercase tracking-[0.16em] text-muted">
                Arranged
              </p>
              <p className="mt-1 text-sm leading-snug">{extra}</p>
            </li>
          ))}
        </ul>
      )}

      <div className="desk-scroll min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6">
        <ol className="mx-auto flex max-w-xl flex-col gap-4">
          {events.map((ev) =>
            ev.kind === "action" ? (
              <ActionCard
                key={ev.action.id}
                action={ev.action}
                needsDesk={conversation.status === "needs_you"}
                onConfirm={() => onConfirmAction(ev.action.id)}
              />
            ) : (
              <Bubble
                key={ev.message.id}
                message={ev.message}
                showTranslation={showTranslation}
              />
            ),
          )}
          {conversation.status === "live" && agentOn && lastGuestOrHold && (
            <li className="flex items-center gap-2 pl-1 text-xs text-muted">
              <span className="live-bars text-primary" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
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
        guest={guest}
        agentOn={agentOn}
        onSend={onSend}
      />
    </div>
  );
}

function Bubble({
  message,
  showTranslation,
}: {
  message: Message;
  showTranslation: boolean;
}) {
  const mine = message.actor !== "guest";
  const { primary, secondary } = messageDisplay(message, showTranslation);
  return (
    <li className={cn("flex flex-col gap-1", mine ? "items-end" : "items-start")}>
      <span className="px-1 text-[0.7rem] font-medium uppercase tracking-[0.16em] text-muted">
        {actorLabel(message.actor)}
        <span className="ml-2 font-sans font-normal normal-case tracking-normal tabular-nums">
          {clock(message.at)}
        </span>
      </span>
      <div
        className={cn(
          "max-w-[min(100%,28rem)] rounded-2xl px-3.5 py-2.5 text-[0.95rem] leading-relaxed",
          message.actor === "guest" &&
            "rounded-tl-md bg-surface text-fg shadow-[var(--shadow-border)]",
          message.actor === "brisa" && "rounded-tr-md bg-sand text-fg",
          message.actor === "desk" && "rounded-tr-md bg-primary text-primary-fg",
        )}
      >
        <p>{primary}</p>
        {secondary && (
          <p
            className={cn(
              "mt-1.5 text-xs leading-relaxed",
              message.actor === "desk" ? "text-primary-fg/70" : "text-muted",
            )}
          >
            {secondary}
          </p>
        )}
      </div>
    </li>
  );
}

function ActionCard({
  action,
  needsDesk,
  onConfirm,
}: {
  action: AiAction;
  needsDesk: boolean;
  onConfirm: () => void;
}) {
  const pending = action.status === "pending";
  const until = action.approvedAt ?? DESK_NOW;
  const wait = waitLabel(action.at, until);
  const gap = pending && waitMinutes(action.at, until) >= GAP_MINUTES;
  const meta = pending
    ? `${needsDesk ? `Needs ${HOUSE.desk}` : "Awaiting guest"} · ${wait}`
    : action.approver
      ? `${action.approver} · ${wait}`
      : null;

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
            <span className="size-1.5 rounded-full bg-muted" />
          )}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">{action.label}</p>
          <p className="mt-0.5 text-xs leading-relaxed text-muted">{action.detail}</p>
          {meta && (
            <p className={cn("mt-1 text-xs tabular-nums", gap ? "text-accent" : "text-muted")}>
              {meta}
            </p>
          )}
        </div>
        {pending && (
          <button
            type="button"
            onClick={onConfirm}
            className="h-11 shrink-0 rounded-full bg-primary px-3 text-xs font-medium text-primary-fg"
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
