import { BedDouble, Mail, MessageCircle, MessageSquare, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { channelLabel, initials, stayLine, DESK_NOW, conversationPreview, langCode, type InboxRow } from "@/lib/desk/data";
import type { Channel, ThreadStatus } from "@/lib/desk/types";

export function ChannelIcon({
  channel,
  className,
}: {
  channel: Channel;
  className?: string;
}) {
  const cls = cn("size-3.5", className);
  if (channel === "voice") return <Phone className={cls} strokeWidth={1.75} />;
  if (channel === "imessage") return <MessageCircle className={cls} strokeWidth={1.75} />;
  if (channel === "email") return <Mail className={cls} strokeWidth={1.75} />;
  if (channel === "booking") return <BedDouble className={cls} strokeWidth={1.75} />;
  if (channel === "whatsapp") {
    return (
      <svg
        viewBox="0 0 24 24"
        className={cls}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        aria-hidden="true"
      >
        <path
          d="M20 12.2A8 8 0 0 1 6.8 19.4L4 20l.8-2.7A8 8 0 1 1 20 12.2Z"
          strokeLinejoin="round"
        />
        <path
          d="M9.2 9.6c.2-.5.3-.5.6-.5h.5c.2 0 .3.1.4.4l.5 1.2c.1.2 0 .4-.1.5l-.4.4a5.5 5.5 0 0 0 2.3 2.3l.4-.4c.2-.2.4-.2.5-.1l1.2.5c.3.1.4.2.4.4v.5c0 .3 0 .4-.5.6A6 6 0 0 1 9.2 9.6Z"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return <MessageSquare className={cls} strokeWidth={1.75} />;
}

function timeLabel(iso: string): string {
  const d = new Date(iso);
  const now = new Date(DESK_NOW);
  const diff = now.getTime() - d.getTime();
  const mins = Math.max(0, Math.round(diff / 60000));
  if (mins < 60) return `${mins}m`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h`;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export function InboxList({
  rows,
  selectedGuestId,
  onSelect,
  showTranslation,
}: {
  rows: InboxRow[];
  selectedGuestId: string;
  onSelect: (conversationId: string) => void;
  showTranslation: boolean;
}) {
  if (rows.length === 0) {
    return <p className="px-4 py-10 text-sm text-muted">Nothing in this view.</p>;
  }

  return (
    <ul className="flex flex-col">
      {rows.map((row) => {
        const active = row.guest.id === selectedGuestId;
        const c = row.latest;
        return (
          <li key={row.guest.id}>
            <button
              type="button"
              onClick={() => onSelect(c.id)}
              className={cn(
                "flex w-full gap-3 px-4 py-3.5 text-left transition-colors",
                active ? "bg-sand/80" : "hover:bg-sand/40",
              )}
            >
              <span
                className={cn(
                  "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full font-display text-xs font-medium",
                  c.status === "live" ? "bg-primary text-primary-fg" : "bg-sand text-fg",
                )}
              >
                {initials(row.guest.name)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span className="truncate text-sm font-medium">{row.guest.name}</span>
                  {c.unread && (
                    <span className="size-1.5 shrink-0 rounded-full bg-accent" aria-label="Unread" />
                  )}
                  <span className="ml-auto shrink-0 text-xs tabular-nums text-muted">
                    {timeLabel(c.lastAt)}
                  </span>
                </span>
                <span className="mt-1 block truncate text-sm text-muted">
                  {conversationPreview(c, showTranslation)}
                </span>
                <span className="mt-1 flex items-center gap-1.5 text-xs text-muted">
                  <span className="flex items-center gap-1">
                    {row.channels.map((ch) => (
                      <ChannelIcon key={ch} channel={ch} />
                    ))}
                  </span>
                  {c.lang !== "en" && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">{langCode(c.lang)}</span>
                    </>
                  )}
                  <span aria-hidden="true">·</span>
                  {c.status === "live" ? (
                    <span className="live-bars text-primary" aria-hidden="true">
                      <span />
                      <span />
                      <span />
                    </span>
                  ) : (
                    <StatusDot status={c.status} />
                  )}
                  <span className="truncate">{stayLine(row.guest)}</span>
                </span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function StatusDot({ status }: { status: ThreadStatus }) {
  return (
    <span
      className={cn(
        "size-1.5 rounded-full",
        status === "needs_you" && "bg-accent",
        status === "brisa" && "bg-primary/50",
        status === "resolved" && "bg-muted/40",
      )}
    />
  );
}

export { channelLabel };
