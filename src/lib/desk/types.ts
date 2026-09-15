export type Channel =
  | "voice"
  | "sms"
  | "imessage"
  | "whatsapp"
  | "email"
  | "booking";

export type ThreadStatus = "live" | "needs_you" | "brisa" | "resolved";

export type Actor = "guest" | "brisa" | "desk";

export type GuestLang = "en" | "es" | "de" | "fr";

export type ActionKind = "fetch" | "hold" | "book" | "change" | "note";

export type ActionStatus = "done" | "pending";

export type RequestType =
  | "availability"
  | "hold"
  | "late_checkout"
  | "early_checkin"
  | "table"
  | "taxi"
  | "boat"
  | "spa"
  | "room_move"
  | "extend"
  | "parking"
  | "note";

export type BookingStatus = "enquiry" | "held" | "confirmed" | "in-house";

export type Message = {
  id: string;
  actor: Actor;
  text: string;
  textEn?: string;
  at: string;
};

export type AiAction = {
  id: string;
  kind: ActionKind;
  type?: RequestType;
  label: string;
  detail: string;
  at: string;
  status: ActionStatus;
  approver?: string | null;
  approvedAt?: string | null;
};

export type Stay = {
  id: string;
  when: string;
  room: string;
  nights: number;
};

export type Booking = {
  confirmation: string;
  room: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  party: number;
  rate: string;
  extras: string[];
  status: BookingStatus;
  purpose: string;
};

export type Guest = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  country: string;
  labels: string[];
  notes: string;
  stays: Stay[];
  booking: Booking | null;
};

export type Conversation = {
  id: string;
  guestId: string;
  channel: Channel;
  lang: GuestLang;
  status: ThreadStatus;
  lastAt: string;
  unread: boolean;
  preview: string;
  messages: Message[];
  actions: AiAction[];
  snippets: string[];
};
