import type {
  AiAction,
  Channel,
  Conversation,
  Guest,
  GuestLang,
  Message,
  RequestType,
  ThreadStatus,
} from "./types";

export const HOUSE = {
  name: "Casa Luz",
  desk: "Clara",
  deskLang: "en" as const,
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
      purpose: "Weekend",
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
      purpose: "Work stay",
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
      purpose: "Tonight",
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
      purpose: "Family stay",
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
      purpose: "Returning",
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
  {
    id: "g-helen",
    name: "Helen Cho",
    phone: "+61 412 880 441",
    email: "helen.cho@me.com",
    country: "Australia",
    labels: ["Early check-in", "Australia"],
    notes: "Flight lands 07:10. Asked for the room from eight.",
    stays: [],
    booking: {
      confirmation: "CL-48520",
      room: "Garden double",
      checkIn: "Sun 30 Aug",
      checkOut: "Wed 2 Sep",
      nights: 3,
      party: 2,
      rate: "€310 / night, breakfast included",
      extras: ["Early check-in (requested)"],
      status: "confirmed",
      purpose: "Long weekend",
    },
  },
  {
    id: "g-luca",
    name: "Luca Moretti",
    phone: "+39 347 221 9088",
    email: "luca.moretti@icloud.com",
    country: "Italy",
    labels: ["OTA", "Italy"],
    notes: "Booked through Booking.com. Wants to add Sunday night.",
    stays: [],
    booking: {
      confirmation: "CL-48533",
      room: "Sea double",
      checkIn: "Fri 4 Sep",
      checkOut: "Sun 6 Sep",
      nights: 2,
      party: 2,
      rate: "€340 / night",
      extras: [],
      status: "confirmed",
      purpose: "Coast weekend",
    },
  },
  {
    id: "g-nora",
    name: "Nora Lind",
    phone: "+47 920 14 882",
    email: "nora.lind@gmail.com",
    country: "Norway",
    labels: ["Arrival", "Norway"],
    notes: "Landing AGP 14:45. Asked for a car.",
    stays: [],
    booking: {
      confirmation: "CL-48541",
      room: "Terrace suite, west",
      checkIn: "Sun 30 Aug",
      checkOut: "Thu 3 Sep",
      nights: 4,
      party: 2,
      rate: "€420 / night, breakfast included",
      extras: ["Airport car (requested)"],
      status: "confirmed",
      purpose: "Late summer",
    },
  },
  {
    id: "g-tomas",
    name: "Tomás Almeida",
    phone: "+351 912 440 118",
    email: "t.almeida@sapo.pt",
    country: "Portugal",
    labels: ["Family", "Two rooms", "Portugal"],
    notes: "Parents plus two teenagers. Want adjoining if we have it.",
    stays: [{ id: "s-t1", when: "Jun 2024", room: "Garden double", nights: 4 }],
    booking: {
      confirmation: "CL-48555",
      room: "Garden double + courtyard king",
      checkIn: "Thu 3 Sep",
      checkOut: "Sun 6 Sep",
      nights: 3,
      party: 4,
      rate: "€560 / night",
      extras: [],
      status: "held",
      purpose: "Family stay",
    },
  },
  {
    id: "g-jonas",
    name: "Jonas Weber",
    phone: "+49 171 882 4401",
    email: "jonas.weber@pm.me",
    country: "Germany",
    labels: ["In house", "Quiet", "Germany"],
    notes: "Asked to move — street noise after one.",
    stays: [],
    booking: {
      confirmation: "CL-48302",
      room: "Sea double",
      checkIn: "Sat 29 Aug",
      checkOut: "Tue 1 Sep",
      nights: 3,
      party: 1,
      rate: "€340 / night",
      extras: [],
      status: "in-house",
      purpose: "Quiet stay",
    },
  },
];

export const CONVERSATIONS: Conversation[] = [
  {
    id: "c-sophie",
    guestId: "g-sophie",
    lang: "fr",
    channel: "voice",
    status: "live",
    lastAt: "2026-08-30T10:36:00+02:00",
    unread: true,
    preview: "Bonjour. Je regarde ce qui est libre pour ce soir — un instant.",
    snippets: [
      "I can take the line if you’d like — one moment.",
      "We have a sea double free tonight, breakfast included. Shall I hold it?",
      "I’ll put you through to Clara at the desk.",
    ],
    messages: [
      {
        id: "m-s1",
        actor: "guest",
        text: "Bonjour — je suis à Málaga, je cherche une chambre pour ce soir. Quelque chose de calme, si vous en avez.",
        textEn:
          "Hello — I’m in Málaga, looking for a room for tonight. Something quiet if you have it.",
        at: "2026-08-30T10:34:12+02:00",
      },
      {
        id: "m-s2",
        actor: "brisa",
        text: "Bonjour. Je regarde ce qui est libre pour ce soir — un instant.",
        textEn: "Good morning. Let me see what’s free for tonight — one moment.",
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
        type: "availability",
      },
      {
        id: "a-s2",
        kind: "hold",
        label: "Hold sea double",
        detail: "One night, Sun 30 Aug. Awaiting guest confirmation.",
        at: "2026-08-30T10:36:00+02:00",
        status: "pending",
        type: "hold",
      },
    ],
  },
  {
    id: "c-james",
    guestId: "g-james",
    lang: "en",
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
        type: "availability",
      },
      {
        id: "a-j2",
        kind: "change",
        label: "Added late checkout",
        detail: "CL-48310 · checkout moved to 13:00, complimentary.",
        at: "2026-08-30T09:13:10+02:00",
        status: "done",
        type: "late_checkout",
        approver: "Brisa",
        approvedAt: "2026-08-30T09:13:10+02:00",
      },
    ],
  },
  {
    id: "c-marta",
    guestId: "g-marta",
    lang: "es",
    channel: "imessage",
    status: "needs_you",
    lastAt: "2026-08-30T09:21:00+02:00",
    unread: true,
    preview: "Y una mesa para cuatro a las ocho el sábado — en la terraza si hay.",
    snippets: [
      "Parking is reserved under Ruiz, bay 4. I’ll ask the skipper about Saturday morning.",
      "I can hold a four-hour boat from 10:00 on Saturday — shall I book it?",
      "The terrace is yours at eight — table for four, children’s menu if you’d like.",
    ],
    messages: [
      {
        id: "m-ma1",
        actor: "guest",
        text: "Hola — confirmamos la suite familiar del 4 al 7 de septiembre. Esta vez llevamos el coche.",
        textEn:
          "Hi — confirming our family suite for 4–7 Sep. We’ll have the car this time.",
        at: "2026-08-30T08:44:00+02:00",
      },
      {
        id: "m-ma2",
        actor: "brisa",
        text: "Bienvenida de nuevo, Marta. La suite familiar está confirmada. Puedo reservaros una plaza de parking — ¿la dejo?",
        textEn:
          "Welcome back Marta. The family suite is confirmed. I can reserve a parking bay — shall I?",
        at: "2026-08-30T08:44:40+02:00",
      },
      {
        id: "m-ma3",
        actor: "guest",
        text: "Necesitamos parking, y nos encantaría un paseo en barco el sábado si aún se puede.",
        textEn:
          "Need parking, and we’d love a boat ride on Saturday if that’s still possible.",
        at: "2026-08-30T08:51:00+02:00",
      },
      {
        id: "m-ma4",
        actor: "guest",
        text: "Y una mesa para cuatro a las ocho el sábado — en la terraza si hay.",
        textEn: "And a table for four at eight on Saturday — terrace if you have it.",
        at: "2026-08-30T09:20:00+02:00",
      },
      {
        id: "m-ma5",
        actor: "brisa",
        text: "Sábado a las ocho, terraza, los cuatro. La dejo reservada — Clara confirmará con cocina.",
        textEn:
          "Saturday at eight, terrace, four of you. I’ll hold it — Clara will confirm with the kitchen.",
        at: "2026-08-30T09:21:00+02:00",
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
        type: "parking",
        approver: "Brisa",
        approvedAt: "2026-08-30T08:45:02+02:00",
      },
      {
        id: "a-ma2",
        kind: "book",
        label: "Request boat operator",
        detail: "Saturday 6 Sep, morning slot for four. Awaiting skipper.",
        at: "2026-08-30T08:51:20+02:00",
        status: "pending",
        type: "boat",
      },
      {
        id: "a-ma3",
        kind: "book",
        label: "Table for four at eight",
        detail: "Saturday 6 Sep, 20:00 · terrace. Awaiting kitchen.",
        at: "2026-08-30T09:21:20+02:00",
        status: "pending",
        type: "table",
      },
    ],
  },
  {
    id: "c-elena",
    guestId: "g-elena",
    lang: "en",
    channel: "whatsapp",
    status: "needs_you",
    lastAt: "2026-08-30T07:49:20+02:00",
    unread: true,
    preview: "One more — a taxi at nine this morning, for María Zambrano.",
    snippets: [
      "Your table is still held for eight. Shall I add a bottle of the house white?",
      "A car at nine for María Zambrano — I’ll have the driver wait at the door.",
      "The west terrace is yours until checkout. Breakfast is from seven.",
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
      {
        id: "m-e7",
        actor: "guest",
        text: "One more — a taxi at nine this morning, for María Zambrano.",
        at: "2026-08-30T07:48:00+02:00",
      },
      {
        id: "m-e8",
        actor: "brisa",
        text: "I can have a car at nine. Clara will confirm with the driver.",
        at: "2026-08-30T07:49:20+02:00",
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
        type: "availability",
      },
      {
        id: "a-e2",
        kind: "hold",
        label: "Held terrace suite",
        detail: "CL-48291 · two nights, party of two.",
        at: "2026-08-28T18:06:40+02:00",
        status: "done",
        type: "hold",
        approver: "Brisa",
        approvedAt: "2026-08-28T18:06:40+02:00",
      },
      {
        id: "a-e3",
        kind: "book",
        label: "Booked terrace restaurant",
        detail: "Saturday 29 Aug, 20:00 · table for two.",
        at: "2026-08-28T18:06:48+02:00",
        status: "done",
        type: "table",
        approver: "Clara",
        approvedAt: "2026-08-28T18:14:00+02:00",
      },
      {
        id: "a-e4",
        kind: "book",
        label: "Taxi at nine",
        detail: "Sun 30 Aug, 09:00 · María Zambrano. Awaiting driver.",
        at: "2026-08-30T07:49:40+02:00",
        status: "pending",
        type: "taxi",
      },
    ],
  },
  {
    id: "c-ana",
    guestId: "g-ana",
    lang: "en",
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
    lang: "en",
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
        type: "availability",
      },
      {
        id: "a-d2",
        kind: "book",
        label: "Held spa",
        detail: "Sat 12 Sep, 10:00 · couple treatment.",
        at: "2026-08-29T11:19:40+02:00",
        status: "done",
        type: "spa",
        approver: "Clara",
        approvedAt: "2026-08-29T11:36:00+02:00",
      },
    ],
  },
  {
    id: "c-elena-voice",
    guestId: "g-elena",
    lang: "en",
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
  {
    id: "c-helen",
    guestId: "g-helen",
    lang: "en",
    channel: "email",
    status: "needs_you",
    lastAt: "2026-08-30T08:12:00+02:00",
    unread: true,
    preview: "Our flight lands at 7:10 — can we have the room from eight?",
    snippets: [
      "Yes — I can have the garden double ready from eight. I’ll note it on the reservation.",
      "Breakfast will still be waiting on the terrace when you arrive.",
    ],
    messages: [
      {
        id: "m-h1",
        actor: "guest",
        text: "Hello — confirming CL-48520 for tonight. Our flight lands at 7:10. Is an eight o’clock check-in possible?",
        at: "2026-08-30T08:04:00+02:00",
      },
      {
        id: "m-h2",
        actor: "brisa",
        text: "Good morning Helen. The garden double is yours. I can ask housekeeping to have it from eight — I’ll confirm shortly.",
        at: "2026-08-30T08:05:20+02:00",
      },
      {
        id: "m-h3",
        actor: "guest",
        text: "Our flight lands at 7:10 — can we have the room from eight?",
        at: "2026-08-30T08:12:00+02:00",
      },
    ],
    actions: [
      {
        id: "a-h1",
        kind: "fetch",
        label: "Checked arrivals",
        detail: "Garden double vacated last night. Ready from 08:00 if we turn it now.",
        at: "2026-08-30T08:05:00+02:00",
        status: "done",
        type: "availability",
      },
      {
        id: "a-h2",
        kind: "change",
        label: "Early check-in 08:00",
        detail: "CL-48520 · awaiting desk confirm with housekeeping.",
        at: "2026-08-30T08:12:20+02:00",
        status: "pending",
        type: "early_checkin",
      },
    ],
  },
  {
    id: "c-luca",
    guestId: "g-luca",
    lang: "en",
    channel: "booking",
    status: "brisa",
    lastAt: "2026-08-29T21:18:00+02:00",
    unread: false,
    preview: "I can add Sunday night on the sea double. Shall I extend it?",
    snippets: [
      "Yes — I’ll extend CL-48533 through Monday morning.",
      "The sea double is free Sunday. I’ll add the night at the same rate.",
    ],
    messages: [
      {
        id: "m-l1",
        actor: "guest",
        text: "Hi — we booked 4–6 Sep through Booking.com. Any chance of adding Sunday night?",
        at: "2026-08-29T21:10:00+02:00",
      },
      {
        id: "m-l2",
        actor: "brisa",
        text: "Good evening Luca. The sea double is free Sunday. I can add the night at the same rate. Shall I extend it?",
        at: "2026-08-29T21:18:00+02:00",
      },
    ],
    actions: [
      {
        id: "a-l1",
        kind: "fetch",
        label: "Checked 6 Sep",
        detail: "Sea double free Sunday. Same rate €340.",
        at: "2026-08-29T21:16:00+02:00",
        status: "done",
        type: "availability",
      },
      {
        id: "a-l2",
        kind: "change",
        label: "Extend through Monday",
        detail: "CL-48533 · checkout to Mon 7 Sep. Awaiting guest yes.",
        at: "2026-08-29T21:18:20+02:00",
        status: "pending",
        type: "extend",
      },
    ],
  },
  {
    id: "c-nora",
    guestId: "g-nora",
    lang: "en",
    channel: "booking",
    status: "brisa",
    lastAt: "2026-08-30T07:42:00+02:00",
    unread: false,
    preview: "A car can meet you at AGP at a quarter to three.",
    snippets: [
      "Yes — I’ll book the car for 14:45, AGP arrivals.",
      "The driver will have a sign for Lind. Forty minutes to the house.",
    ],
    messages: [
      {
        id: "m-n1",
        actor: "guest",
        text: "Hello, reservation CL-48541. We land at AGP at 14:45 today. Could you arrange a car?",
        at: "2026-08-30T07:28:00+02:00",
      },
      {
        id: "m-n2",
        actor: "brisa",
        text: "Of course, Nora. A car can meet you at a quarter to three. The driver will have a sign for Lind. Shall I book it?",
        at: "2026-08-30T07:42:00+02:00",
      },
    ],
    actions: [
      {
        id: "a-n1",
        kind: "book",
        label: "Airport car AGP 14:45",
        detail: "Sign for Lind · ~40 minutes to the house. Awaiting confirm.",
        at: "2026-08-30T07:42:20+02:00",
        status: "pending",
        type: "taxi",
      },
    ],
  },
  {
    id: "c-tomas",
    guestId: "g-tomas",
    lang: "en",
    channel: "email",
    status: "needs_you",
    lastAt: "2026-08-30T09:02:00+02:00",
    unread: true,
    preview: "We need two rooms that connect — the teenagers are 15 and 17.",
    snippets: [
      "Garden double and courtyard king share a door on the first floor. I’ll hold both.",
      "I can put you on the same landing if the connecting pair is taken.",
    ],
    messages: [
      {
        id: "m-t1",
        actor: "guest",
        text: "Olá — we stayed in a garden double in 2024. This time we’re four. Do you have connecting rooms for 3–6 Sep?",
        at: "2026-08-30T08:50:00+02:00",
      },
      {
        id: "m-t2",
        actor: "brisa",
        text: "Welcome back Tomás. Garden double and courtyard king can share a door on the first floor those nights. I’ll hold both if you’d like.",
        at: "2026-08-30T08:52:40+02:00",
      },
      {
        id: "m-t3",
        actor: "guest",
        text: "We need two rooms that connect — the teenagers are 15 and 17. Can someone confirm the layout?",
        at: "2026-08-30T09:02:00+02:00",
      },
    ],
    actions: [
      {
        id: "a-t1",
        kind: "hold",
        label: "Held connecting pair",
        detail: "Garden double + courtyard king, first floor, 3–6 Sep.",
        at: "2026-08-30T08:53:00+02:00",
        status: "done",
        type: "hold",
        approver: "Brisa",
        approvedAt: "2026-08-30T08:53:00+02:00",
      },
    ],
  },
  {
    id: "c-jonas",
    guestId: "g-jonas",
    lang: "de",
    channel: "sms",
    status: "needs_you",
    lastAt: "2026-08-30T01:16:00+02:00",
    unread: true,
    preview: "Der Innenhof-King ist nach dem Frühstück frei. Clara bestätigt den Umzug.",
    snippets: [
      "I’m sorry. I can move you to a courtyard king on the first floor as soon as it’s ready.",
      "I’ll have extra water sent up now, and we’ll move you after breakfast if you prefer.",
    ],
    messages: [
      {
        id: "m-jo1",
        actor: "guest",
        text: "Hallo — das Doppelzimmer zum Meer ist schön, aber die Straße ist immer noch laut. Gibt es ein ruhigeres Zimmer?",
        textEn:
          "Hi — the sea double is lovely but the street is still loud. Any chance of a quieter room?",
        at: "2026-08-30T01:14:00+02:00",
      },
      {
        id: "m-jo2",
        actor: "brisa",
        text: "Es tut mir leid, Jonas. Ich schaue nach einem ruhigeren Zimmer — einen Moment.",
        textEn: "I’m sorry, Jonas. Let me look for a quieter room — one moment.",
        at: "2026-08-30T01:14:40+02:00",
      },
      {
        id: "m-jo3",
        actor: "brisa",
        text: "Der Innenhof-King ist nach dem Frühstück frei. Clara bestätigt den Umzug.",
        textEn:
          "The courtyard king is free after breakfast. Clara will confirm the move.",
        at: "2026-08-30T01:16:00+02:00",
      },
    ],
    actions: [
      {
        id: "a-jo1",
        kind: "fetch",
        label: "Checked quiet rooms",
        detail: "Courtyard king 12 vacated. Ready after 11:00.",
        at: "2026-08-30T01:15:00+02:00",
        status: "done",
        type: "availability",
      },
      {
        id: "a-jo2",
        kind: "change",
        label: "Move to courtyard king",
        detail: "CL-48302 · after breakfast. Awaiting Clara.",
        at: "2026-08-30T01:15:20+02:00",
        status: "pending",
        type: "room_move",
      },
    ],
  },
];

export const SOPHIE_HOLD_FR =
  "J’ai une double mer de libre ce soir — calme, petit-déjeuner compris. Je vous la réserve ?";
export const SOPHIE_HOLD_EN =
  "I have a sea double free tonight — quiet, breakfast included. Shall I hold it for you?";

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
    case "email":
      return "Email";
    case "booking":
      return "Booking.com";
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

export function langName(lang: GuestLang): string {
  switch (lang) {
    case "es":
      return "Spanish";
    case "de":
      return "German";
    case "fr":
      return "French";
    default:
      return "English";
  }
}

export function langCode(lang: GuestLang): string {
  return lang.toUpperCase();
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

export function stayLine(guest: Guest): string {
  const booking = guest.booking;
  if (!booking) return "No current booking";
  const dates = `${booking.checkIn} – ${booking.checkOut}`;
  return booking.purpose ? `${dates} · ${booking.purpose}` : `${dates} · ${booking.room}`;
}

export function lastMessage(conversation: Conversation): Message | undefined {
  return [...conversation.messages].sort((a, b) => a.at.localeCompare(b.at)).at(-1);
}

export function conversationPreview(conversation: Conversation, translated: boolean): string {
  const last = lastMessage(conversation);
  if (!last) return conversation.preview;
  if (translated) return last.textEn ?? last.text;
  return last.text;
}

export function messageDisplay(
  message: Message,
  translated: boolean,
): { primary: string; secondary?: string } {
  if (translated && message.textEn && message.textEn !== message.text) {
    return { primary: message.textEn, secondary: message.text };
  }
  return { primary: message.text };
}

export function jumpInMessage(lang: GuestLang): { text: string; textEn: string } {
  switch (lang) {
    case "fr":
      return {
        text: "Clara à la réception — je suis avec vous.",
        textEn: "Clara at the desk — I’m with you now.",
      };
    case "es":
      return {
        text: "Clara en recepción — estoy con vosotros.",
        textEn: "Clara at the desk — I’m with you now.",
      };
    case "de":
      return {
        text: "Clara an der Rezeption — ich bin jetzt für Sie da.",
        textEn: "Clara at the desk — I’m with you now.",
      };
    default:
      return {
        text: "Clara at the desk — I’m with you now.",
        textEn: "Clara at the desk — I’m with you now.",
      };
  }
}

const PHRASES: { en: string; es?: string; de?: string; fr?: string }[] = [
  {
    en: "I can take the line if you’d like — one moment.",
    fr: "Je peux prendre la ligne si vous voulez — un instant.",
  },
  {
    en: "We have a sea double free tonight, breakfast included. Shall I hold it?",
    fr: "Nous avons une double mer de libre ce soir, petit-déjeuner compris. Je vous la réserve ?",
  },
  {
    en: "I’ll put you through to Clara at the desk.",
    fr: "Je vous passe Clara à la réception.",
  },
  {
    en: "Parking is reserved under Ruiz, bay 4. I’ll ask the skipper about Saturday morning.",
    es: "El parking está reservado a nombre de Ruiz, plaza 4. Pregunto al patrón por el sábado por la mañana.",
  },
  {
    en: "I can hold a four-hour boat from 10:00 on Saturday — shall I book it?",
    es: "Puedo reservar un barco de cuatro horas a las 10:00 del sábado — ¿lo dejo?",
  },
  {
    en: "The terrace is yours at eight — table for four, children’s menu if you’d like.",
    es: "La terraza es vuestra a las ocho — mesa para cuatro, menú infantil si queréis.",
  },
  {
    en: "I’m sorry. I can move you to a courtyard king on the first floor as soon as it’s ready.",
    de: "Es tut mir leid. Ich kann Sie in einen Innenhof-King im ersten Stock legen, sobald er bereit ist.",
  },
  {
    en: "I’ll have extra water sent up now, and we’ll move you after breakfast if you prefer.",
    de: "Ich schicke jetzt extra Wasser hoch, und nach dem Frühstück ziehen wir Sie um, wenn Sie möchten.",
  },
  {
    en: "Clara at the desk — I’m with you now.",
    fr: "Clara à la réception — je suis avec vous.",
    es: "Clara en recepción — estoy con vosotros.",
    de: "Clara an der Rezeption — ich bin jetzt für Sie da.",
  },
];

export function localTranslate(text: string, lang: GuestLang): string | null {
  if (lang === "en") return text.trim();
  const n = text.trim();
  if (!n) return null;
  const hit = PHRASES.find((p) => p.en === n);
  return hit?.[lang] ?? null;
}

export type InboxRow = {
  guest: Guest;
  latest: Conversation;
  channels: Channel[];
  conversations: Conversation[];
};

const STATUS_RANK: Record<ThreadStatus, number> = {
  live: 0,
  needs_you: 1,
  brisa: 2,
  resolved: 3,
};

export function inboxRows(
  conversations: Conversation[],
  guests: Guest[],
): InboxRow[] {
  const grouped = new Map<string, Conversation[]>();
  for (const c of conversations) {
    const list = grouped.get(c.guestId) ?? [];
    list.push(c);
    grouped.set(c.guestId, list);
  }

  const rows: InboxRow[] = [];
  for (const [guestId, convos] of grouped) {
    const guest = guests.find((g) => g.id === guestId);
    if (!guest) continue;
    const sorted = [...convos].sort((a, b) => b.lastAt.localeCompare(a.lastAt));
    const latest =
      [...sorted].sort((a, b) => STATUS_RANK[a.status] - STATUS_RANK[b.status])[0] ??
      sorted[0]!;
    const channels: Channel[] = [];
    for (const c of sorted) {
      if (!channels.includes(c.channel)) channels.push(c.channel);
    }
    rows.push({ guest, latest, channels, conversations: sorted });
  }

  return rows.sort((a, b) => b.latest.lastAt.localeCompare(a.latest.lastAt));
}

export function rowMatchesQuery(row: InboxRow, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const hay = [
    row.guest.name,
    row.guest.email ?? "",
    row.guest.phone,
    row.guest.country,
    row.guest.notes,
    row.guest.booking?.room ?? "",
    row.guest.booking?.purpose ?? "",
    row.latest.preview,
    langName(row.latest.lang),
    langCode(row.latest.lang),
    ...row.channels.map(channelLabel),
    ...row.conversations.flatMap((c) =>
      c.messages.flatMap((m) => [m.text, m.textEn ?? ""]),
    ),
  ]
    .join(" ")
    .toLowerCase();
  return hay.includes(q);
}

export const DESK_NOW = "2026-08-30T10:39:00+02:00";

export const REQUEST_TYPE_LABEL: Record<RequestType, string> = {
  availability: "Availability",
  hold: "Hold",
  late_checkout: "Late checkout",
  early_checkin: "Early check-in",
  table: "Table",
  taxi: "Taxi",
  boat: "Boat",
  spa: "Spa",
  room_move: "Room move",
  extend: "Extend stay",
  parking: "Parking",
  note: "Note",
};

export const AUTO_APPROVE_TYPES: RequestType[] = [
  "late_checkout",
  "parking",
  "table",
  "taxi",
  "spa",
  "early_checkin",
  "hold",
  "boat",
  "room_move",
  "extend",
];

export const DEFAULT_AUTO_APPROVE: RequestType[] = ["late_checkout", "parking"];

export function isReviewable(action: AiAction): boolean {
  if (!action.type) return false;
  return action.type !== "availability" && action.type !== "note";
}

export function requestTypeLabel(type: RequestType): string {
  return REQUEST_TYPE_LABEL[type];
}

export function waitMinutes(fromIso: string, toIso = DESK_NOW): number {
  const from = new Date(fromIso).getTime();
  const to = new Date(toIso).getTime();
  return Math.max(0, Math.round((to - from) / 60000));
}

export function waitLabel(fromIso: string, toIso = DESK_NOW): string {
  const mins = waitMinutes(fromIso, toIso);
  if (mins < 1) return "same minute";
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h < 24) return m ? `${h}h ${m}m` : `${h}h`;
  const d = Math.floor(h / 24);
  return `${d}d`;
}

export const GAP_MINUTES = 45;

export type ApprovalRow = {
  action: AiAction;
  conversation: Conversation;
  guest: Guest;
  waitMins: number;
  gap: boolean;
  needsDesk: boolean;
};

export function flattenApprovals(
  conversations: Conversation[],
  guests: Guest[],
  now = DESK_NOW,
): ApprovalRow[] {
  const rows: ApprovalRow[] = [];
  for (const conversation of conversations) {
    const guest = guests.find((g) => g.id === conversation.guestId);
    if (!guest) continue;
    for (const action of conversation.actions) {
      if (!isReviewable(action)) continue;
      const end = action.approvedAt ?? now;
      const waitMins = waitMinutes(action.at, end);
      const needsDesk = conversation.status === "needs_you";
      rows.push({
        action,
        conversation,
        guest,
        waitMins,
        gap: waitMins >= GAP_MINUTES,
        needsDesk,
      });
    }
  }
  return rows.sort((a, b) => {
    if (a.action.status !== b.action.status) {
      return a.action.status === "pending" ? -1 : 1;
    }
    if (a.needsDesk !== b.needsDesk) return a.needsDesk ? -1 : 1;
    return b.waitMins - a.waitMins;
  });
}

export function approvalSummary(rows: ApprovalRow[]) {
  const pending = rows.filter((r) => r.action.status === "pending");
  const signed = rows.filter((r) => r.action.status === "done");
  const desk = pending.filter((r) => r.needsDesk);
  const guestWait = pending.filter((r) => !r.needsDesk);
  const gaps = rows.filter((r) => r.gap);
  const deskSigned = signed.filter(
    (r) => r.action.approver && r.action.approver !== "Brisa",
  );
  const waits = deskSigned
    .filter((r) => !r.gap)
    .map((r) => r.waitMins)
    .sort((a, b) => a - b);
  const typical = waits.length === 0 ? null : waits[Math.floor((waits.length - 1) / 2)]!;
  return {
    pending: pending.length,
    desk: desk.length,
    guestWait: guestWait.length,
    signed: signed.length,
    gaps: gaps.length,
    typicalWait: typical,
  };
}

export function clockLabel(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Madrid",
  });
}
