import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const POINTS = [
  {
    title: "Your number, her voice",
    body: "Brisa sits on the line you already publish. Guests do not learn a new habit.",
  },
  {
    title: "Your house, her memory",
    body: "Rates, room types, spa hours, the restaurant’s last seating. She speaks for the property you run.",
  },
  {
    title: "Staff keep the exceptions",
    body: "Routine calls stop landing on the night manager. Unusual ones arrive with context.",
  },
];

export function ForHotels() {
  return (
    <section id="hotels" className="scroll-mt-24 border-y border-line bg-surface">
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
        <div className="max-w-2xl">
          <p className="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-muted">
            For hotels
          </p>
          <h2 className="mt-3 font-display text-4xl font-medium tracking-tight sm:text-5xl">
            Put Brisa on the front desk line.
          </h2>
          <p className="mt-5 max-w-xl text-[1.05rem] leading-relaxed text-muted">
            HelloBrisa is the voice layer for independent hotels and small groups. She answers
            every ring, books against your inventory, and leaves a record your team can trust.
          </p>
        </div>
        <ul className="mt-14 grid gap-10 sm:grid-cols-3">
          {POINTS.map((point) => (
            <li key={point.title}>
              <h3 className="font-display text-xl font-medium">{point.title}</h3>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">{point.body}</p>
            </li>
          ))}
        </ul>
        <div className="mt-12">
          <a href="/demo" className={cn(buttonVariants({ size: "lg" }))}>
            Open the desk
          </a>
        </div>
      </div>
    </section>
  );
}
