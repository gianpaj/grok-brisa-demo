import { useEffect, useState } from "react";
import { channelLabel, initials, statusLabel } from "@/lib/desk/data";
import type { Conversation, Guest } from "@/lib/desk/types";
import { ChannelIcon } from "./inbox";

export function GuestPanel({
  guest,
  conversations,
  onNotes,
  onOpenConversation,
}: {
  guest: Guest;
  conversations: Conversation[];
  onNotes: (notes: string) => void;
  onOpenConversation?: (id: string) => void;
}) {
  const [notes, setNotes] = useState(guest.notes);
  useEffect(() => {
    setNotes(guest.notes);
  }, [guest.id, guest.notes]);

  const booking = guest.booking;
  const threads = conversations.filter((c) => c.guestId === guest.id);

  return (
    <div className="desk-scroll h-full overflow-y-auto bg-surface">
      <div className="border-b border-line px-5 py-5">
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-full bg-sand font-display text-sm font-medium">
            {initials(guest.name)}
          </span>
          <div className="min-w-0">
            <p className="font-display text-xl font-medium tracking-tight">{guest.name}</p>
            <p className="truncate text-xs text-muted">{guest.phone}</p>
          </div>
        </div>
        {guest.labels.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {guest.labels.map((label) => (
              <li
                key={label}
                className="rounded-full bg-sand px-2.5 py-1 text-xs font-medium text-fg"
              >
                {label}
              </li>
            ))}
          </ul>
        )}
        <p className="mt-3 text-xs text-muted">Flying from {guest.country}</p>
      </div>

      <section className="border-b border-line px-5 py-5">
        <h2 className="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-muted">
          Booking
        </h2>
        {booking ? (
          <dl className="mt-3 space-y-2 text-sm">
            <Row label="Status" value={bookingStatus(booking.status)} />
            <Row label="Room" value={booking.room} />
            <Row label="Stay" value={`${booking.checkIn} → ${booking.checkOut}`} />
            <Row label="Nights" value={`${booking.nights} · party of ${booking.party}`} />
            <Row label="Rate" value={booking.rate} />
            <Row label="Ref" value={booking.confirmation} />
            {booking.extras.length > 0 && (
              <Row label="Extras" value={booking.extras.join(" · ")} />
            )}
          </dl>
        ) : (
          <p className="mt-3 text-sm text-muted">No current booking.</p>
        )}
      </section>

      <section className="border-b border-line px-5 py-5">
        <h2 className="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-muted">
          Notes
        </h2>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={() => onNotes(notes)}
          rows={4}
          placeholder="Need parking, boat ride, quiet floor…"
          className="mt-3 w-full resize-none rounded-xl bg-bg px-3 py-2.5 text-sm leading-relaxed text-fg shadow-[var(--shadow-border)] outline-none placeholder:text-muted focus:shadow-[var(--shadow-border-hover)]"
        />
      </section>

      <section className="border-b border-line px-5 py-5">
        <h2 className="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-muted">
          Conversations
        </h2>
        <ul className="mt-3 space-y-1">
          {threads.map((t) => (
            <li key={t.id}>
              <button
                type="button"
                onClick={() => onOpenConversation?.(t.id)}
                className="flex w-full items-center justify-between gap-3 rounded-lg px-2 py-2 text-left text-sm hover:bg-sand/60"
              >
                <span className="flex items-center gap-2 text-fg">
                  <ChannelIcon channel={t.channel} className="text-muted" />
                  {channelLabel(t.channel)}
                </span>
                <span className="text-xs text-muted">{statusLabel(t.status)}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="px-5 py-5">
        <h2 className="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-muted">
          Previous stays
        </h2>
        {guest.stays.length === 0 ? (
          <p className="mt-3 text-sm text-muted">First stay at the house.</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {guest.stays.map((s) => (
              <li key={s.id} className="text-sm">
                <p className="font-medium">{s.when}</p>
                <p className="text-muted">
                  {s.room} · {s.nights} nights
                </p>
              </li>
            ))}
          </ul>
        )}
        {guest.email && (
          <p className="mt-4 truncate text-xs text-muted">{guest.email}</p>
        )}
      </section>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="shrink-0 text-muted">{label}</dt>
      <dd className="text-right">{value}</dd>
    </div>
  );
}

function bookingStatus(status: string): string {
  if (status === "in-house") return "In house";
  return status.charAt(0).toUpperCase() + status.slice(1);
}
