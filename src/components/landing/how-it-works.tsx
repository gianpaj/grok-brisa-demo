const STEPS = [
  {
    n: "01",
    title: "A guest calls the hotel",
    body: "Same number as always. No app to download, no hold music, no phone tree.",
  },
  {
    n: "02",
    title: "Brisa answers",
    body: "She books, checks dates, and knows the pool hours — in the guest’s language, at two in the morning.",
  },
  {
    n: "03",
    title: "Your team sees the note",
    body: "Every call leaves a clean summary. When a person should take over, she hands it off.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-24 sm:px-8 sm:py-32">
      <p className="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-muted">
        How it works
      </p>
      <h2 className="mt-3 max-w-xl font-display text-4xl font-medium tracking-tight text-fg sm:text-5xl">
        The desk, without the desk.
      </h2>
      <ol className="mt-14 grid gap-10 sm:grid-cols-3 sm:gap-8">
        {STEPS.map((step) => (
          <li key={step.n} className="border-t border-line pt-6">
            <p className="font-display text-sm italic text-muted">{step.n}</p>
            <h3 className="mt-3 font-display text-2xl font-medium tracking-tight">{step.title}</h3>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">{step.body}</p>
          </li>
        ))}
      </ol>
      <p className="mt-12">
        <a href="/demo" className="text-sm font-medium text-primary transition-colors hover:text-fg">
          Open the desk
        </a>
      </p>
    </section>
  );
}
