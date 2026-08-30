import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, PanelRight } from "lucide-react";
import { Wordmark } from "@/components/landing/wordmark";
import { InboxList } from "@/components/desk/inbox";
import { Thread } from "@/components/desk/thread";
import { GuestPanel } from "@/components/desk/guest-panel";
import { CONVERSATIONS, GUESTS, HOUSE, guestById } from "@/lib/desk/data";
import type { Conversation, Guest, ThreadStatus } from "@/lib/desk/types";
import { cn } from "@/lib/utils";

type Filter = "all" | "needs_you" | "live";
type MobilePane = "list" | "thread" | "guest";

export function DeskPage() {
  const [conversations, setConversations] = useState<Conversation[]>(CONVERSATIONS);
  const [guests, setGuests] = useState<Guest[]>(GUESTS);
  const [selectedId, setSelectedId] = useState(CONVERSATIONS[0]!.id);
  const [filter, setFilter] = useState<Filter>("all");
  const [jumped, setJumped] = useState<Record<string, boolean>>({});
  const [mobile, setMobile] = useState<MobilePane>("list");
  const liveOnce = useRef(false);

  useEffect(() => {
    document.title = "Desk · HelloBrisa";
    return () => {
      document.title = "HelloBrisa";
    };
  }, []);

  useEffect(() => {
    if (liveOnce.current) return;
    const t = window.setTimeout(() => {
      liveOnce.current = true;
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== "c-sophie") return c;
          if (c.messages.some((m) => m.id === "m-s3")) return c;
          const at = new Date().toISOString();
          return {
            ...c,
            lastAt: at,
            preview: "I have a sea double free tonight…",
            messages: [
              ...c.messages,
              {
                id: "m-s3",
                actor: "brisa" as const,
                text: "I have a sea double free tonight — quiet, breakfast included. Shall I hold it for you?",
                at,
              },
            ],
          };
        }),
      );
    }, 2800);
    return () => window.clearTimeout(t);
  }, []);

  const filtered = useMemo(() => {
    const list =
      filter === "all"
        ? conversations
        : filter === "live"
          ? conversations.filter((c) => c.status === "live")
          : conversations.filter((c) => c.status === "needs_you");
    return [...list].sort((a, b) => b.lastAt.localeCompare(a.lastAt));
  }, [conversations, filter]);

  const conversation =
    conversations.find((c) => c.id === selectedId) ?? conversations[0]!;
  const guest = guestById(conversation.guestId, guests)!;
  const jumpedIn = Boolean(jumped[conversation.id]);
  const needsCount = conversations.filter((c) => c.status === "needs_you").length;
  const liveCount = conversations.filter((c) => c.status === "live").length;

  const select = (id: string) => {
    setSelectedId(id);
    setMobile("thread");
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unread: false } : c)),
    );
  };

  const jump = () => {
    setJumped((j) => ({ ...j, [conversation.id]: true }));
    if (conversation.status !== "live") return;
    const now = new Date().toISOString();
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== conversation.id) return c;
        if (c.messages.some((m) => m.actor === "desk")) return c;
        return {
          ...c,
          lastAt: now,
          preview: "Clara at the desk — I’m on the line with you.",
          messages: [
            ...c.messages,
            {
              id: `m-jump-${now}`,
              actor: "desk" as const,
              text: "Clara at the desk — I’m on the line with you.",
              at: now,
            },
          ],
        };
      }),
    );
  };

  const send = (text: string) => {
    const now = new Date().toISOString();
    setJumped((j) => ({ ...j, [conversation.id]: true }));
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== conversation.id) return c;
        return {
          ...c,
          status: "needs_you" as ThreadStatus,
          lastAt: now,
          preview: text,
          unread: false,
          messages: [
            ...c.messages,
            { id: `m-${now}`, actor: "desk" as const, text, at: now },
          ],
        };
      }),
    );
  };

  const confirmAction = (actionId: string) => {
    const now = new Date().toISOString();
    const action = conversation.actions.find((a) => a.id === actionId);
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== conversation.id) return c;
        const done = c.actions.map((a) =>
          a.id === actionId ? { ...a, status: "done" as const } : a,
        );
        const note = action
          ? {
              id: `m-act-${now}`,
              actor: "desk" as const,
              text: `Confirmed: ${action.label}.`,
              at: now,
            }
          : null;
        return {
          ...c,
          actions: done,
          messages: note ? [...c.messages, note] : c.messages,
        };
      }),
    );

    if (actionId === "a-s2") {
      setGuests((prev) =>
        prev.map((g) => {
          if (g.id !== "g-sophie") return g;
          const labels = g.labels.includes("Held") ? g.labels : [...g.labels, "Held"];
          return {
            ...g,
            labels,
            booking: {
              confirmation: "CL-48501",
              room: "Sea double",
              checkIn: "Sun 30 Aug",
              checkOut: "Mon 31 Aug",
              nights: 1,
              party: 1,
              rate: "€260 / night, breakfast included",
              extras: ["Breakfast"],
              status: "held",
            },
          };
        }),
      );
    }

    if (actionId === "a-ma2") {
      setGuests((prev) =>
        prev.map((g) => {
          if (g.id !== "g-marta" || !g.booking) return g;
          const extras = g.booking.extras.includes("Boat Saturday 10:00")
            ? g.booking.extras
            : [...g.booking.extras, "Boat Saturday 10:00"];
          return {
            ...g,
            notes: g.notes.includes("Boat held")
              ? g.notes
              : `${g.notes} Boat held Saturday 10:00.`,
            booking: { ...g.booking, extras },
          };
        }),
      );
    }
  };

  const saveNotes = (notes: string) => {
    setGuests((prev) => prev.map((g) => (g.id === guest.id ? { ...g, notes } : g)));
  };

  return (
    <div className="flex h-svh flex-col overflow-hidden bg-bg text-fg">
      <div className="flex min-h-0 flex-1">
        <aside
          className={cn(
            "w-full shrink-0 flex-col border-r border-line bg-surface lg:flex lg:w-72",
            mobile === "list" ? "flex" : "hidden lg:flex",
          )}
        >
          <div className="flex h-14 items-center justify-between border-b border-line px-4">
            <Wordmark />
            <a href="/" className="text-xs text-muted hover:text-fg">
              Site
            </a>
          </div>
          <div className="border-b border-line px-4 py-3">
            <p className="text-sm font-medium">{HOUSE.name}</p>
            <p className="text-xs text-muted">
              {HOUSE.desk} · {HOUSE.role}
            </p>
            <p className="mt-1 text-xs text-muted">
              {HOUSE.when} · {HOUSE.occupancy} occupied
            </p>
          </div>
          <div className="flex gap-1 px-3 py-2">
            {(
              [
                ["all", "All", 0],
                ["needs_you", "Needs you", needsCount],
                ["live", "Live", liveCount],
              ] as const
            ).map(([id, label, count]) => (
              <button
                key={id}
                type="button"
                onClick={() => setFilter(id)}
                className={cn(
                  "h-11 rounded-full px-3 text-xs font-medium",
                  filter === id ? "bg-fg text-bg" : "text-muted hover:text-fg",
                )}
              >
                {label}
                {id !== "all" && count > 0 ? ` ${count}` : ""}
              </button>
            ))}
          </div>
          <div className="desk-scroll min-h-0 flex-1 overflow-y-auto">
            <InboxList
              conversations={filtered}
              guests={guests}
              selectedId={conversation.id}
              onSelect={select}
            />
          </div>
        </aside>

        <section
          className={cn(
            "min-w-0 flex-1 flex-col",
            mobile === "thread" ? "flex" : "hidden lg:flex",
          )}
        >
          <div className="flex items-center gap-2 border-b border-line px-2 lg:hidden">
            <button
              type="button"
              className="flex size-11 items-center justify-center text-fg"
              onClick={() => setMobile("list")}
              aria-label="Back to inbox"
            >
              <ArrowLeft className="size-5" strokeWidth={1.75} />
            </button>
            <span className="flex-1 truncate text-sm font-medium">{guest.name}</span>
            <button
              type="button"
              className="flex size-11 items-center justify-center text-fg"
              onClick={() => setMobile("guest")}
              aria-label="Guest file"
            >
              <PanelRight className="size-5" strokeWidth={1.75} />
            </button>
          </div>
          <div className="min-h-0 flex-1">
            <Thread
              conversation={conversation}
              guest={guest}
              jumpedIn={jumpedIn}
              onJump={jump}
              onSend={send}
              onConfirmAction={confirmAction}
            />
          </div>
        </section>

        <aside
          className={cn(
            "w-full shrink-0 flex-col border-l border-line lg:flex lg:w-80",
            mobile === "guest" ? "flex" : "hidden lg:flex",
          )}
        >
          <div className="flex h-11 items-center border-b border-line px-2 lg:hidden">
            <button
              type="button"
              className="flex size-11 items-center justify-center text-fg"
              onClick={() => setMobile("thread")}
              aria-label="Back to thread"
            >
              <ArrowLeft className="size-5" strokeWidth={1.75} />
            </button>
            <span className="text-sm font-medium">Guest file</span>
          </div>
          <div className="min-h-0 flex-1">
            <GuestPanel
              guest={guest}
              conversations={conversations}
              onNotes={saveNotes}
              onOpenConversation={select}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
