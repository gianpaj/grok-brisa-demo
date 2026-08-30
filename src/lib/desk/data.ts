import type { Channel, Conversation, Guest, ThreadStatus } from "./types";

export const HOUSE = {
  name: "Casa Luz",
  desk: "Clara",
  role: "Front desk",
  when: "Sunday morning",
  occupancy: "86%",
};

export const GUESTS: Guest[] = [
  {
    id: "g-elena",
    name: "Elena Voss",
    phone: "+44 7700 900214",
    email: "elena.voss@icloud.com",
    country: "United Kingdom",
    labels: ["Couple", "Sea view", "UK"],
    notes: "Prefers west-facing rooms. Breakfast on the terrace.",
    stays: [{ id: "s-e1", when: "May 2025", room: "Garden double", nights: 3 }],
    booking: {
      confirmation: "CL-48291",
      room: "Terrace suite, west",
      checkIn: "Fri 28 Aug",
      checkOut: "Sun 30 Aug",
      nights: 2,
      party: 2,
      rate: "€420 / night, breakfast included",
      extras: ["Breakfast", "Dinner Sat 20:00"],
      status: "in-house",
    },
  },
  {
    id: "g-james",
    name: "James Okonkwo",
    phone: "+1 415 555 0198",
    email: "j.okonkwo@pm.me",
    country: "United States",
    labels: ["Solo", "Late checkout", "US"],
    notes: "Quiet floor. Working remotely this morning.",
    stays: [],
    booking: {
      confirmation: "CL-48310",
      room: "Courtyard king",
      checkIn: "Thu 27 Aug",
      checkOut: "Sun 30 Aug",
      nights: 3,
      party: 1,
      rate: "€280 / night",
      extras: ["Late checkout 13:00"],
      status: "in-house",
    },
  },
  {
    id: "g-sophie",
    name: "Sophie Laurent",
    phone: "+33 6 12 44 08 19",
    country: "France",
    labels: ["Tonight", "France"],
    notes: "",
    stays: [],
    booking: {
      confirmation: "—",
      room: "Checking availability",
      checkIn: "Sun 30 Aug",
      checkOut: "Mon 31 Aug",
      nights: 1,
      party: 1,
      rate: "—",
      extras: [],
      status: "enquiry",
    },
  },
  {
    id: "g-marta",
    name: "Marta Ruiz",
    phone: "+34 612 448 201",
    email: "marta.ruiz@gmail.com",
    country: "Spain",
    labels: ["Family", "Parking", "Spain"],
    notes: "Need parking. Like to book a boat ride. Two children, 6 and 9.",
    stays: [
      { id: "s-m1", when: "Aug 2024", room: "Family suite", nights: 5 },
      { id: "s-m2", when: "Jul 2023", room: "Family suite", nights: 4 },
    ],
    booking: {
      confirmation: "CL-48402",
      room: "Family suite",
      checkIn: "Fri 4 Sep",
      checkOut: "Mon 7 Sep",
      nights: 3,
      party: 4,
      rate: "€510 / night",
      extras: ["Parking (requested)"],
      status: "confirmed",
    },
  },
  {
    id: "g-david",
    name: "David Park",
    phone: "+82 10 5552 8811",
    email: "david.park@kakao.com",
    country: "South Korea",
    labels: ["Returning", "Quiet", "Korea"],
    notes: "Asked for the same courtyard room as last year.",
    stays: [
      { id: "s-d1", when: "Sep 2025", room: "Courtyard king", nights: 4 },
      { id: "s-d2", when: "Apr 2024", room: "Courtyard king", nights: 3 },
    ],
    booking: {
      confirmation: "CL-48488",
      room: "Courtyard king",
      checkIn: "Fri 11 Sep",
      checkOut: "Tue 15 Sep",
      nights: 4,
      party: 2,
      rate: "€280 / night, breakfast included",
      extras: ["Spa 12 Sep, 10:00"],
      status: "confirmed",
    },
  },
  {
    id: "g-ana",
    name: "Ana Berg",
    phone: "+46 70 123 8890",
    country: "Sweden",
    labels: ["Couple", "Sweden"],
    notes: "Left a kind note at breakfast.",
    stays: [{ id: "s-a1", when: "Aug 2026", room: "Sea double", nights: 2 }],
    booking: null,
  },
];

export const CONVERSATIONS: Conversation[] = [
  {
    id: "c-sophie",
    guestId: "g-sophie",
    channel: "voice",
    status: "live",
    lastAt: "2026-08-30T10:36:00+02:00",
    unread: true,
    preview: "Brisa is checking a room for tonight…",
    snippets: [
      "I can take the line if you’d like — one moment.",
      "We have a sea double free tonight, breakfast included. Shall I hold it?",
      "I’ll put you through to Clara at the desk.",
    ],
    messages: [
      {
        id: "m-s1",
        actor: "guest",
        text: "Bonjour — I’m in Málaga, looking for a room for tonight. Something quiet if you have it.",
        at: "2026-08-30T10:34:12+02:00",
      },
      {
        id: "m-s2",
        actor: "brisa",
        text: "Good morning. Let me see what’s free for tonight — one moment.",
        at: "2026-08-30T10:34:40+02:00",
      },
    ],
    actions: [
      {
        id: "a-s1",
        kind: "fetch",
        label: "Fetched tonight’s availability",
        detail: "Sea double and courtyard king free. Occupancy 86%.",
        at: "2026-08-30T10:35:08+02:00",
        status: "done",
      },
      {
        id: "a-s2",
        kind: "hold",
        label: "Hold sea double",
        detail: "One night, Sun 30 Aug. Awaiting guest confirmation.",
        at: "2026-08-30T10:36:00+02:00",
        status: "pending",
      },
    ],
  },
  {
    id: "c-james",
    guestId: "g-james",
    channel: "sms",
    status: "needs_you",
    lastAt: "2026-08-30T09:18:00+02:00",
    unread: true,
    preview: "Can someone confirm the 1pm checkout in writing?",
    snippets: [
      "Yes — late checkout is confirmed through 1pm. I’ll have the room held.",
      "Of course. I’ve added a 13:00 checkout to CL-48310.",
      "The courtyard is quiet until two; you’re welcome to work in the library after if you need.",
    ],
    messages: [
      {
        id: "m-j1",
        actor: "guest",
        text: "Hi — any chance of a late checkout today? I have a call until noon.",
        at: "2026-08-30T09:12:04+02:00",
      },
      {
        id: "m-j2",
        actor: "brisa",
        text: "Good morning James. I can extend you through 1pm at no charge. Shall I add that to the room?",
        at: "2026-08-30T09:12:51+02:00",
      },
      {
        id: "m-j3",
        actor: "guest",
        text: "Please. And can someone confirm the 1pm checkout in writing?",
        at: "2026-08-30T09:18:00+02:00",
      },
    ],
    actions: [
      {
        id: "a-j1",
        kind: "fetch",
        label: "Checked occupancy for Sunday",
        detail: "Courtyard king not arriving until 16:00. Late checkout available.",
        at: "2026-08-30T09:12:40+02:00",
        status: "done",
      },
      {
        id: "a-j2",
        kind: "change",
        label: "Added late checkout",
        detail: "CL-48310 · checkout moved to 13:00, complimentary.",
        at: "2026-08-30T09:13:10+02:00",
        status: "done",
      },
    ],
  },
  {
    id: "c-marta",
    guestId: "g-marta",
    channel: "imessage",
    status: "needs_you",
    lastAt: "2026-08-30T08:51:00+02:00",
    unread: true,
    preview: "Need parking, and we’d love a boat ride on Saturday.",
    snippets: [
      "Parking is reserved under Ruiz, bay 4. I’ll ask the skipper about Saturday morning.",
      "I can hold a four-hour boat from 10:00 on Saturday — shall I book it?",
      "The family suite is ready with two extra beds. Parking is included.",
    ],
    messages: [
      {
        id: "m-ma1",
        actor: "guest",
        text: "Hola — confirming our family suite for 4–7 Sep. We’ll have the car this time.",
        at: "2026-08-30T08:44:00+02:00",
      },
      {
        id: "m-ma2",
        actor: "brisa",
        text: "Welcome back Marta. The family suite is confirmed. I can reserve a parking bay — shall I?",
        at: "2026-08-30T08:44:40+02:00",
      },
      {
        id: "m-ma3",
        actor: "guest",
        text: "Need parking, and we’d love a boat ride on Saturday if that’s still possible.",
        at: "2026-08-30T08:51:00+02:00",
      },
    ],
    actions: [
      {
        id: "a-ma1",
        kind: "note",
        label: "Noted parking",
        detail: "Bay requested for family suite CL-48402.",
        at: "2026-08-30T08:45:02+02:00",
        status: "done",
      },
      {
        id: "a-ma2",
        kind: "book",
        label: "Request boat operator",
        detail: "Saturday 6 Sep, morning slot for four. Awaiting skipper.",
        at: "2026-08-30T08:51:20+02:00",
        status: "pending",
      },
    ],
  },
  {
    id: "c-elena",
    guestId: "g-elena",
    channel: "whatsapp",
    status: "brisa",
    lastAt: "2026-08-29T19:42:00+02:00",
    unread: false,
    preview: "Done. Your confirmation is on its way…",
    snippets: [
      "Your table is still held for eight. Shall I add a bottle of the house white?",
      "The west terrace is yours until checkout. Breakfast is from seven.",
      "I’ll have the car ready at ten if you’d like a lift to the station.",
    ],
    messages: [
      {
        id: "m-e1",
        actor: "guest",
        text: "Hi — I'd like a room for two this weekend. Somewhere quiet, with a sea view if you have it.",
        at: "2026-08-28T18:04:00+02:00",
      },
      {
        id: "m-e2",
        actor: "brisa",
        text: "Good evening. I have a terrace suite free Friday through Sunday — west-facing, two nights, breakfast included. Shall I hold it?",
        at: "2026-08-28T18:04:40+02:00",
      },
      {
        id: "m-e3",
        actor: "guest",
        text: "What's included? And is there a pool?",
        at: "2026-08-28T18:05:12+02:00",
      },
      {
        id: "m-e4",
        actor: "brisa",
        text: "The infinity pool is open until ten, and the spa from seven. I can add a table at the terrace restaurant for Saturday at eight, if you'd like.",
        at: "2026-08-28T18:05:48+02:00",
      },
      {
        id: "m-e5",
        actor: "guest",
        text: "Perfect. Book it — and yes to dinner.",
        at: "2026-08-28T18:06:20+02:00",
      },
      {
        id: "m-e6",
        actor: "brisa",
        text: "Done. Your confirmation is on its way, and I'll have the room ready. Is there anything else I can arrange?",
        at: "2026-08-28T18:06:55+02:00",
      },
    ],
    actions: [
      {
        id: "a-e1",
        kind: "fetch",
        label: "Fetched weekend availability",
        detail: "Terrace suite west free Fri–Sun. Breakfast included.",
        at: "2026-08-28T18:04:28+02:00",
        status: "done",
      },
      {
        id: "a-e2",
        kind: "hold",
        label: "Held terrace suite",
        detail: "CL-48291 · two nights, party of two.",
        at: "2026-08-28T18:06:40+02:00",
        status: "done",
      },
      {
        id: "a-e3",
        kind: "book",
        label: "Booked terrace restaurant",
        detail: "Saturday 29 Aug, 20:00 · table for two.",
        at: "2026-08-28T18:06:48+02:00",
        status: "done",
      },
    ],
  },
  {
    id: "c-ana",
    guestId: "g-ana",
    channel: "sms",
    status: "resolved",
    lastAt: "2026-08-29T16:10:00+02:00",
    unread: false,
    preview: "Thank you — we had a lovely stay.",
    snippets: [
      "We’re glad you did. You’re welcome back any time.",
      "I’ll keep the sea double noted for next summer.",
    ],
    messages: [
      {
        id: "m-an1",
        actor: "guest",
        text: "Thank you — we had a lovely stay.",
        at: "2026-08-29T16:10:00+02:00",
      },
      {
        id: "m-an2",
        actor: "brisa",
        text: "Thank you, Ana. The sea double will remember you. Safe travels home.",
        at: "2026-08-29T16:11:00+02:00",
      },
    ],
    actions: [],
  },
  {
    id: "c-david",
    guestId: "g-david",
    channel: "whatsapp",
    status: "brisa",
    lastAt: "2026-08-29T11:20:00+02:00",
    unread: false,
    preview: "Spa is held for Saturday at ten.",
    snippets: [
      "The courtyard king is yours again — same room as last September.",
      "Spa is held for Saturday at ten. I’ll send a reminder the day before.",
      "Quiet floor, as before. Breakfast from seven on the terrace.",
    ],
    messages: [
      {
        id: "m-d1",
        actor: "guest",
        text: "Hello — booking for 11–15 Sep. Same courtyard room as last year, if possible.",
        at: "2026-08-29T11:02:00+02:00",
      },
      {
        id: "m-d2",
        actor: "brisa",
        text: "Of course, David. Courtyard king is free those nights. Breakfast included. I can add a spa hour on Saturday morning.",
        at: "2026-08-29T11:03:10+02:00",
      },
      {
        id: "m-d3",
        actor: "guest",
        text: "Yes to the spa. Thank you.",
        at: "2026-08-29T11:19:00+02:00",
      },
      {
        id: "m-d4",
        actor: "brisa",
        text: "Confirmed. CL-48488, courtyard king, spa Saturday at ten. We’ll have the room as you left it.",
        at: "2026-08-29T11:20:00+02:00",
      },
    ],
    actions: [
      {
        id: "a-d1",
        kind: "fetch",
        label: "Matched previous stay",
        detail: "Courtyard king · Sep 2025 stay recalled.",
        at: "2026-08-29T11:02:40+02:00",
        status: "done",
      },
      {
        id: "a-d2",
        kind: "book",
        label: "Held spa",
        detail: "Sat 12 Sep, 10:00 · couple treatment.",
        at: "2026-08-29T11:19:40+02:00",
        status: "done",
      },
    ],
  },
  {
    id: "c-elena-voice",
    guestId: "g-elena",
    channel: "voice",
    status: "resolved",
    lastAt: "2026-08-28T16:12:00+02:00",
    unread: false,
    preview: "We’ll have the west terrace ready for six.",
    snippets: [
      "Checkout is eleven, unless you’d like a late one.",
      "I can have a car for the station at ten.",
    ],
    messages: [
      {
        id: "m-ev1",
        actor: "guest",
        text: "Hello — Elena Voss, checking in. We should have the west terrace.",
        at: "2026-08-28T16:08:00+02:00",
      },
      {
        id: "m-ev2",
        actor: "brisa",
        text: "Welcome. The terrace suite is ready, west-facing. Breakfast from seven. I’ll have your bags sent up.",
        at: "2026-08-28T16:09:20+02:00",
      },
      {
        id: "m-ev3",
        actor: "guest",
        text: "Lovely. We’ll come down around six.",
        at: "2026-08-28T16:11:10+02:00",
      },
      {
        id: "m-ev4",
        actor: "brisa",
        text: "We’ll have the west terrace ready for six. Enjoy the evening.",
        at: "2026-08-28T16:12:00+02:00",
      },
    ],
    actions: [
      {
        id: "a-ev1",
        kind: "fetch",
        label: "Pulled arrival",
        detail: "CL-48291 · terrace suite west · party of two.",
        at: "2026-08-28T16:08:40+02:00",
        status: "done",
      },
    ],
  },
];

export function guestById(id: string, guests = GUESTS): Guest | undefined {
  return guests.find((g) => g.id === id);
}

export function channelLabel(channel: Channel): string {
  switch (channel) {
    case "voice":
      return "Voice";
    case "sms":
      return "SMS";
    case "imessage":
      return "iMessage";
    case "whatsapp":
      return "WhatsApp";
  }
}

export function statusLabel(status: ThreadStatus): string {
  switch (status) {
    case "live":
      return "Live";
    case "needs_you":
      return "Needs you";
    case "brisa":
      return "Brisa";
    case "resolved":
      return "Resolved";
  }
}

export function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");
}

export function localSnippets(draft: string, snippets: string[]): string[] {
  const q = draft.trim().toLowerCase();
  if (!q) return snippets.slice(0, 3);
  const hit = snippets.filter(
    (s) =>
      s.toLowerCase().includes(q) ||
      q.split(" ").some((w) => w.length > 2 && s.toLowerCase().includes(w)),
  );
  return (hit.length ? hit : snippets).slice(0, 3);
}
