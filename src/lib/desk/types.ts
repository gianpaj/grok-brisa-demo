export type Channel = "voice" | "sms" | "imessage" | "whatsapp";

export type ThreadStatus = "live" | "needs_you" | "brisa" | "resolved";

export type Actor = "guest" | "brisa" | "desk";

export type ActionKind = "fetch" | "hold" | "book" | "change" | "note";

export type ActionStatus = "done" | "pending";

export type BookingStatus = "enquiry" | "held" | "confirmed" | "in-house";

export type Message = {
  id: string;
  actor: Actor;
  text: string;
  at: string;
};

export type AiAction = {
  id: string;
  kind: ActionKind;
  label: string;
  detail: string;
  at: string;
  status: ActionStatus;
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
  status: ThreadStatus;
  lastAt: string;
  unread: boolean;
  preview: string;
  messages: Message[];
  actions: AiAction[];
  snippets: string[];
};
