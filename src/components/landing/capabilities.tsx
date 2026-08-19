const ITEMS = [
  {
    title: "Reservations",
    body: "Hold, book, change, or cancel — and confirm before she hangs up.",
  },
  {
    title: "Availability",
    body: "Dates, views, bed type, adjoining rooms. She checks before she promises.",
  },
  {
    title: "The house",
    body: "Pool hours, spa, dining, late checkout, extra pillows. The things a good night desk knows.",
  },
  {
    title: "A person, when needed",
    body: "Complaints, emergencies, odd requests. She takes a note and connects the call.",
  },
];

export function Capabilities() {
  return (
    <section id="handles" className="scroll-mt-24 bg-sand/50">
      <div className="mx-auto grid max-w-6xl gap-14 px-5 py-24 sm:px-8 sm:py-32 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
        <div>
          <p className="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-muted">
            What she handles
          </p>
          <h2 className="mt-3 font-display text-4xl font-medium tracking-tight sm:text-5xl">
            Everything a receptionist should, and nothing she shouldn’t.
          </h2>
        </div>
        <ul className="divide-y divide-line">
          {ITEMS.map((item) => (
            <li
              key={item.title}
              className="grid gap-2 py-6 first:pt-0 sm:grid-cols-[10rem_1fr] sm:gap-8"
            >
              <h3 className="font-display text-xl font-medium">{item.title}</h3>
              <p className="text-[0.95rem] leading-relaxed text-muted">{item.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
