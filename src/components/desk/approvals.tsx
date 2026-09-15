import { cn } from "@/lib/utils";
import {
  HOUSE,
  requestTypeLabel,
  waitLabel,
  DESK_NOW,
  clockLabel,
  type ApprovalRow,
} from "@/lib/desk/data";
import type { RequestType } from "@/lib/desk/types";

export type ApprovalFilter = "waiting" | "signed" | "all";

export function filterApprovalRows(
  rows: ApprovalRow[],
  filter: ApprovalFilter,
): ApprovalRow[] {
  if (filter === "waiting") return rows.filter((r) => r.action.status === "pending");
  if (filter === "signed") return rows.filter((r) => r.action.status === "done");
  return rows;
}

function autoLine(autoTypes: Set<RequestType>): string {
  const names = [...autoTypes].map(requestTypeLabel);
  if (names.length === 0) return "None yet — open a request to mark it safe.";
  return `Auto: ${names.join(" · ")}`;
}

export function ApprovalList({
  rows,
  selectedId,
  onSelect,
  autoTypes,
  filter,
  onFilter,
  summary,
}: {
  rows: ApprovalRow[];
  selectedId: string | null;
  onSelect: (actionId: string) => void;
  autoTypes: Set<RequestType>;
  filter: ApprovalFilter;
  onFilter: (filter: ApprovalFilter) => void;
  summary: {
    pending: number;
    desk: number;
    guestWait: number;
    signed: number;
    gaps: number;
    typicalWait: number | null;
  };
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="border-b border-line px-4 py-3">
        <p className="text-sm text-muted">
          {summary.desk} on the desk
          {summary.guestWait > 0 ? ` · ${summary.guestWait} with the guest` : ""}
          {summary.gaps > 0 ? ` · ${summary.gaps} gaps` : ""}
        </p>
        <p className="mt-1 text-xs text-muted">
          {summary.typicalWait == null
            ? "No desk sign-offs yet this morning."
            : `Desk typically ${summary.typicalWait}m.`}
        </p>
        <p className="mt-1 text-xs text-muted">{autoLine(autoTypes)}</p>
      </div>
      <div className="flex gap-1 px-3 py-2">
        {(
          [
            ["waiting", "Waiting", summary.pending],
            ["signed", "Signed", summary.signed],
            ["all", "All", 0],
          ] as const
        ).map(([id, label, count]) => (
          <button
            key={id}
            type="button"
            onClick={() => onFilter(id)}
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
        {rows.length === 0 ? (
          <p className="px-4 py-10 text-sm text-muted">Nothing in this view.</p>
        ) : (
          <ul className="flex flex-col">
            {rows.map((row) => {
              const active = row.action.id === selectedId;
              const until = row.action.approvedAt ?? DESK_NOW;
              return (
                <li key={row.action.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(row.action.id)}
                    className={cn(
                      "flex w-full flex-col gap-1 px-4 py-3.5 text-left transition-colors",
                      active ? "bg-sand/80" : "hover:bg-sand/40",
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <span className="truncate text-sm font-medium">{row.guest.name}</span>
                      <span
                        className={cn(
                          "ml-auto shrink-0 text-xs tabular-nums",
                          row.gap ? "text-accent" : "text-muted",
                        )}
                      >
                        {waitLabel(row.action.at, until)}
                      </span>
                    </span>
                    <span className="truncate text-sm text-muted">{row.action.label}</span>
                    <span className="text-xs text-muted">
                      {requestTypeLabel(row.action.type!)}
                      <span aria-hidden="true"> · </span>
                      {row.action.status === "done"
                        ? row.action.approver ?? HOUSE.desk
                        : row.needsDesk
                          ? `Needs ${HOUSE.desk}`
                          : "Awaiting guest"}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export function ApprovalDetail({
  row,
  autoTypes,
  onToggleAuto,
  onConfirm,
  onOpenThread,
}: {
  row: ApprovalRow | null;
  autoTypes: Set<RequestType>;
  onToggleAuto: (type: RequestType) => void;
  onConfirm: (actionId: string) => void;
  onOpenThread: (conversationId: string) => void;
}) {
  if (!row) {
    return (
      <div className="flex h-full items-center justify-center bg-bg px-6">
        <p className="text-sm text-muted">Select a request.</p>
      </div>
    );
  }

  const action = row.action;
  const type = action.type!;
  const until = action.approvedAt ?? DESK_NOW;
  const wait = waitLabel(action.at, until);
  const pending = action.status === "pending";
  const autoOn = autoTypes.has(type);
  const who = pending
    ? row.needsDesk
      ? `Needs ${HOUSE.desk}`
      : "Awaiting guest"
    : action.approver ?? HOUSE.desk;

  return (
    <div className="flex h-full min-h-0 flex-col bg-bg">
      <header className="border-b border-line px-4 py-4 sm:px-6">
        <p className="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-muted">
          {requestTypeLabel(type)}
        </p>
        <h1 className="mt-2 font-display text-2xl font-medium tracking-tight">
          {action.label}
        </h1>
        <p className="mt-1 text-sm text-muted">
          {row.guest.name}
          <span aria-hidden="true"> · </span>
          {row.guest.booking?.confirmation ?? "No ref"}
        </p>
      </header>

      <div className="desk-scroll min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        <div className="mx-auto flex max-w-xl flex-col gap-6">
          <p className="text-[0.95rem] leading-relaxed">{action.detail}</p>

          <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <div>
              <dt className="text-xs text-muted">Requested</dt>
              <dd className="mt-0.5 tabular-nums">{clock(action.at)}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted">{pending ? "Waiting" : "Took"}</dt>
              <dd
                className={cn(
                  "mt-0.5 tabular-nums",
                  row.gap && "text-accent",
                )}
              >
                {wait}
                {row.gap ? " · gap" : ""}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted">{pending ? "Status" : "Signed by"}</dt>
              <dd className="mt-0.5">{who}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Signed at</dt>
              <dd className="mt-0.5 tabular-nums">
                {action.approvedAt ? clock(action.approvedAt) : "—"}
              </dd>
            </div>
          </dl>

          <div className="flex flex-wrap gap-2">
            {pending && (
              <button
                type="button"
                onClick={() => onConfirm(action.id)}
                className="h-11 rounded-full bg-primary px-5 text-sm font-medium text-primary-fg"
              >
                Confirm
              </button>
            )}
            <button
              type="button"
              onClick={() => onOpenThread(row.conversation.id)}
              className="h-11 rounded-full bg-sand px-5 text-sm font-medium text-fg"
            >
              Open thread
            </button>
          </div>

          <div className="rounded-xl bg-surface px-4 py-4 shadow-[var(--shadow-border)]">
            <p className="text-sm font-medium">
              {autoOn
                ? `Brisa will confirm ${requestTypeLabel(type).toLowerCase()} requests.`
                : `Mark ${requestTypeLabel(type).toLowerCase()} as auto approve?`}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted">
              Safe requests skip the desk next time. Who signed is still recorded.
            </p>
            <button
              type="button"
              onClick={() => onToggleAuto(type)}
              aria-pressed={autoOn}
              className={cn(
                "mt-3 h-11 rounded-full px-4 text-sm font-medium",
                autoOn ? "bg-primary text-primary-fg" : "bg-sand text-fg",
              )}
            >
              {autoOn ? "Auto approve on" : "Auto approve"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function clock(iso: string): string {
  return clockLabel(iso);
}
