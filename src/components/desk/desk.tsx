import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Languages, PanelRight, Search } from "lucide-react";
import { Wordmark } from "@/components/landing/wordmark";
import { InboxList } from "@/components/desk/inbox";
import { Thread } from "@/components/desk/thread";
import { GuestPanel } from "@/components/desk/guest-panel";
import {
  ApprovalDetail,
  ApprovalList,
  filterApprovalRows,
  type ApprovalFilter,
} from "@/components/desk/approvals";
import {
  CONVERSATIONS,
  GUESTS,
  HOUSE,
  guestById,
  inboxRows,
  rowMatchesQuery,
  flattenApprovals,
  approvalSummary,
  DEFAULT_AUTO_APPROVE,
  DESK_NOW,
  SOPHIE_HOLD_EN,
  SOPHIE_HOLD_FR,
  jumpInMessage,
} from "@/lib/desk/data";
import type { Actor, Conversation, Guest, RequestType, ThreadStatus } from "@/lib/desk/types";
import { cn } from "@/lib/utils";

type Filter = "all" | "needs_you" | "agent";
type MobilePane = "list" | "thread" | "guest";
type DeskView = "inbox" | "approvals";

export function DeskPage() {
  useEffect(() => {
    document.title = "Desk · HelloBrisa";
    return () => {
      document.title = "HelloBrisa";
    };
  }, []);

  const [conversations, setConversations] = useState<Conversation[]>(CONVERSATIONS);
  const [guests, setGuests] = useState<Guest[]>(GUESTS);
  const [selectedId, setSelectedId] = useState(CONVERSATIONS[0]!.id);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [jumped, setJumped] = useState<Record<string, boolean>>({});
  const [mobile, setMobile] = useState<MobilePane>("list");
  const [view, setView] = useState<DeskView>("inbox");
  const [approvalFilter, setApprovalFilter] = useState<ApprovalFilter>("waiting");
  const [selectedActionId, setSelectedActionId] = useState<string | null>(null);
  const [autoTypes, setAutoTypes] = useState<Set<RequestType>>(
    () => new Set(DEFAULT_AUTO_APPROVE),
  );
  const [showTranslation, setShowTranslation] = useState(false);
  const liveOnce = useRef(false);

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
            preview: SOPHIE_HOLD_FR,
            messages: [
              ...c.messages,
              {
                id: "m-s3",
                actor: "brisa" as const,
                text: SOPHIE_HOLD_FR,
                textEn: SOPHIE_HOLD_EN,
                at,
              },
            ],
          };
        }),
      );
    }, 2800);
    return () => window.clearTimeout(t);
  }, []);

  const conversation =
    conversations.find((c) => c.id === selectedId) ?? conversations[0]!;
  const inboxGuest = guestById(conversation.guestId, guests)!;
  const guestThreads = conversations.filter((c) => c.guestId === inboxGuest.id);
  const agentOn =
    !jumped[conversation.id] &&
    (conversation.status === "live" || conversation.status === "brisa");

  const needsCount = conversations.filter((c) => c.status === "needs_you").length;
  const agentCount = conversations.filter(
    (c) =>
      (c.status === "live" || c.status === "brisa") && !jumped[c.id],
  ).length;

  const approvalRows = useMemo(
    () => flattenApprovals(conversations, guests),
    [conversations, guests],
  );
  const summary = useMemo(() => approvalSummary(approvalRows), [approvalRows]);
  const visibleApprovals = useMemo(
    () => filterApprovalRows(approvalRows, approvalFilter),
    [approvalRows, approvalFilter],
  );
  const selectedApproval =
    approvalRows.find((r) => r.action.id === selectedActionId) ??
    (view === "approvals" ? visibleApprovals[0] ?? null : null);

  const guest =
    view === "approvals" && selectedApproval
      ? guestById(selectedApproval.guest.id, guests) ?? inboxGuest
      : inboxGuest;

  const rows = useMemo(() => {
    let list = conversations;
    if (filter === "needs_you") list = list.filter((c) => c.status === "needs_you");
    if (filter === "agent") {
      list = list.filter(
        (c) => (c.status === "live" || c.status === "brisa") && !jumped[c.id],
      );
    }
    return inboxRows(list, guests).filter((row) => rowMatchesQuery(row, query));
  }, [conversations, guests, filter, query, jumped]);

  const select = (id: string) => {
    setSelectedId(id);
    setMobile("thread");
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unread: false } : c)),
    );
  };

  const toggleAgent = () => {
    if (agentOn) {
      setJumped((j) => ({ ...j, [conversation.id]: true }));
      if (conversation.status === "live" || conversation.status === "brisa") {
        const now = new Date().toISOString();
        const jump = jumpInMessage(conversation.lang);
        setConversations((prev) =>
          prev.map((c) => {
            if (c.id !== conversation.id) return c;
            if (c.messages.some((m) => m.actor === "desk")) {
              return { ...c, status: "needs_you" as ThreadStatus };
            }
            return {
              ...c,
              status: "needs_you" as ThreadStatus,
              lastAt: now,
              preview: jump.text,
              messages: [
                ...c.messages,
                {
                  id: `m-jump-${now}`,
                  actor: "desk" as const,
                  text: jump.text,
                  textEn: jump.textEn,
                  at: now,
                },
              ],
            };
          }),
        );
      }
      return;
    }
    setJumped((j) => ({ ...j, [conversation.id]: false }));
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversation.id
          ? { ...c, status: conversation.status === "live" ? c.status : ("brisa" as ThreadStatus) }
          : c,
      ),
    );
  };

  const send = (text: string, textEn?: string) => {
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
            { id: `m-${now}`, actor: "desk" as const, text, textEn, at: now },
          ],
        };
      }),
    );
  };

  const confirmActions = (actionIds: string[], approver: string = HOUSE.desk) => {
    if (actionIds.length === 0) return;
    const now = DESK_NOW;
    const idSet = new Set(actionIds);
    setConversations((prev) =>
      prev.map((c) => {
        const hits = c.actions.filter((a) => idSet.has(a.id) && a.status === "pending");
        if (hits.length === 0) return c;
        const actions = c.actions.map((a) =>
          idSet.has(a.id) && a.status === "pending"
            ? { ...a, status: "done" as const, approver, approvedAt: now }
            : a,
        );
        const notes = hits.map((action) => ({
          id: `m-act-${action.id}-${now}`,
          actor: (approver === "Brisa" ? "brisa" : "desk") as Actor,
          text: `Confirmed: ${action.label}.`,
          at: now,
        }));
        return {
          ...c,
          actions,
          lastAt: now,
          preview: notes.at(-1)?.text ?? c.preview,
          messages: [...c.messages, ...notes],
        };
      }),
    );

    const patchGuest = (id: string, fn: (g: Guest) => Guest) => {
      setGuests((prev) => prev.map((g) => (g.id === id ? fn(g) : g)));
    };

    for (const actionId of actionIds) {
      if (actionId === "a-s2") {
        patchGuest("g-sophie", (g) => {
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
              purpose: "Tonight",
            },
          };
        });
      }

      if (actionId === "a-ma2") {
        patchGuest("g-marta", (g) => {
          if (!g.booking) return g;
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
        });
      }

      if (actionId === "a-ma3") {
        patchGuest("g-marta", (g) => {
          if (!g.booking) return g;
          const extras = g.booking.extras.includes("Table Saturday 20:00")
            ? g.booking.extras
            : [...g.booking.extras, "Table Saturday 20:00"];
          return { ...g, booking: { ...g.booking, extras } };
        });
      }

      if (actionId === "a-h2") {
        patchGuest("g-helen", (g) => {
          if (!g.booking) return g;
          const extras = g.booking.extras.includes("Early check-in 08:00")
            ? g.booking.extras
            : ["Early check-in 08:00"];
          return { ...g, booking: { ...g.booking, extras } };
        });
      }

      if (actionId === "a-l2") {
        patchGuest("g-luca", (g) => {
          if (!g.booking) return g;
          return {
            ...g,
            booking: {
              ...g.booking,
              checkOut: "Mon 7 Sep",
              nights: 3,
            },
          };
        });
      }

      if (actionId === "a-n1") {
        patchGuest("g-nora", (g) => {
          if (!g.booking) return g;
          return {
            ...g,
            booking: {
              ...g.booking,
              extras: ["Airport car AGP 14:45"],
            },
          };
        });
      }

      if (actionId === "a-e4") {
        patchGuest("g-elena", (g) => {
          if (!g.booking) return g;
          const extras = g.booking.extras.includes("Taxi 09:00 María Zambrano")
            ? g.booking.extras
            : [...g.booking.extras, "Taxi 09:00 María Zambrano"];
          return { ...g, booking: { ...g.booking, extras } };
        });
      }

      if (actionId === "a-jo2") {
        patchGuest("g-jonas", (g) => {
          if (!g.booking) return g;
          return {
            ...g,
            notes: "Moved to courtyard king after breakfast.",
            booking: { ...g.booking, room: "Courtyard king" },
          };
        });
      }
    }
  };

  const confirmAction = (actionId: string) => confirmActions([actionId], HOUSE.desk);

  const toggleAuto = (type: RequestType) => {
    const enabling = !autoTypes.has(type);
    setAutoTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
    if (!enabling) return;
    const pendingIds = conversations.flatMap((c) =>
      c.actions
        .filter((a) => a.status === "pending" && a.type === type)
        .map((a) => a.id),
    );
    confirmActions(pendingIds, "Brisa");
  };

  const openApproval = (actionId: string) => {
    setSelectedActionId(actionId);
    const row = approvalRows.find((r) => r.action.id === actionId);
    if (row) {
      setSelectedId(row.conversation.id);
      setConversations((prev) =>
        prev.map((c) => (c.id === row.conversation.id ? { ...c, unread: false } : c)),
      );
    }
    setMobile("thread");
  };

  const openThread = (conversationId: string) => {
    setView("inbox");
    select(conversationId);
  };

  const saveNotes = (notes: string) => {
    setGuests((prev) => prev.map((g) => (g.id === guest.id ? { ...g, notes } : g)));
  };

  return (
    <div className="flex h-svh flex-col overflow-hidden bg-bg text-fg">
      <div className="flex min-h-0 flex-1">
        <aside
          className={cn(
            "w-full shrink-0 flex-col border-r border-line bg-surface lg:flex lg:w-80",
            mobile === "list" ? "flex" : "hidden lg:flex",
          )}
        >
          <div className="flex h-14 items-center justify-between gap-2 border-b border-line px-2 sm:px-3">
            <div className="flex min-w-0 items-center gap-0.5">
              <button
                type="button"
                onClick={() => setShowTranslation((v) => !v)}
                className={cn(
                  "flex h-11 shrink-0 items-center gap-1.5 rounded-full px-2.5 text-xs font-medium transition-colors",
                  showTranslation
                    ? "bg-primary text-primary-fg shadow-[var(--shadow-border)]"
                    : "text-muted hover:text-fg",
                )}
                aria-pressed={showTranslation}
                aria-label={
                  showTranslation
                    ? "Show original languages"
                    : "Show English translations"
                }
                title={
                  showTranslation
                    ? "Show original languages"
                    : "Show English translations"
                }
              >
                <Languages className="size-4" strokeWidth={1.75} />
                {showTranslation ? HOUSE.deskLang.toUpperCase() : null}
              </button>
              <Wordmark />
            </div>
            <a href="/" className="shrink-0 px-2 text-xs text-muted hover:text-fg">
              Site
            </a>
          </div>
          <div className="border-b border-line px-4 py-3">
            <p className="text-sm font-medium">{HOUSE.name}</p>
            <p className="text-xs text-muted">
              {view === "approvals"
                ? `Requests · ${HOUSE.desk} · ${HOUSE.occupancy} occupied`
                : `One inbox · ${HOUSE.desk} · ${HOUSE.occupancy} occupied`}
            </p>
            <div className="mt-3 flex gap-1">
              {(
                [
                  ["inbox", "Inbox", 0],
                  ["approvals", "Approvals", summary.desk],
                ] as const
              ).map(([id, label, count]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setView(id);
                    setMobile("list");
                    if (id === "approvals") {
                      const row =
                        (selectedActionId
                          ? approvalRows.find((r) => r.action.id === selectedActionId)
                          : null) ?? visibleApprovals[0];
                      if (row) {
                        setSelectedActionId(row.action.id);
                        setSelectedId(row.conversation.id);
                      }
                    }
                  }}
                  className={cn(
                    "h-11 rounded-full px-3 text-xs font-medium",
                    view === id ? "bg-fg text-bg" : "text-muted hover:text-fg",
                  )}
                >
                  {label}
                  {id === "approvals" && count > 0 ? ` ${count}` : ""}
                </button>
              ))}
            </div>
          </div>
          {view === "inbox" ? (
            <>
              <div className="border-b border-line px-3 py-2">
                <label className="sr-only" htmlFor="inbox-search">
                  Search guests
                </label>
                <div className="flex h-11 items-center gap-2 rounded-xl bg-bg px-3 shadow-[var(--shadow-border)] focus-within:shadow-[var(--shadow-border-hover)]">
                  <Search className="size-4 text-muted" strokeWidth={1.75} />
                  <input
                    id="inbox-search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search guests, rooms, channels…"
                    className="min-w-0 flex-1 bg-transparent text-sm text-fg outline-none placeholder:text-muted"
                  />
                </div>
              </div>
              <div className="flex gap-1 px-3 py-2">
                {(
                  [
                    ["all", "All", 0],
                    ["needs_you", "Needs you", needsCount],
                    ["agent", "Agent", agentCount],
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
                  rows={rows}
                  selectedGuestId={guest.id}
                  onSelect={select}
                  showTranslation={showTranslation}
                />
              </div>
            </>
          ) : (
            <ApprovalList
              rows={visibleApprovals}
              selectedId={selectedApproval?.action.id ?? null}
              onSelect={openApproval}
              autoTypes={autoTypes}
              filter={approvalFilter}
              onFilter={setApprovalFilter}
              summary={summary}
            />
          )}
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
              aria-label={view === "approvals" ? "Back to requests" : "Back to inbox"}
            >
              <ArrowLeft className="size-5" strokeWidth={1.75} />
            </button>
            <span className="flex-1 truncate text-sm font-medium">
              {view === "approvals"
                ? (selectedApproval?.action.label ?? "Request")
                : guest.name}
            </span>
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
            {view === "approvals" ? (
              <ApprovalDetail
                row={selectedApproval}
                autoTypes={autoTypes}
                onToggleAuto={toggleAuto}
                onConfirm={confirmAction}
                onOpenThread={openThread}
              />
            ) : (
              <Thread
                conversation={conversation}
                guest={inboxGuest}
                channels={guestThreads}
                agentOn={agentOn}
                onToggleAgent={toggleAgent}
                onSelectChannel={select}
                onSend={send}
                onConfirmAction={confirmAction}
                showTranslation={showTranslation}
              />
            )}
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
