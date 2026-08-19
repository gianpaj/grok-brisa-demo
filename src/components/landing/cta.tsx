import { Button } from "@/components/ui/button";

type CtaProps = {
  onTalk: () => void;
};

export function Cta({ onTalk }: CtaProps) {
  return (
    <section className="mx-auto max-w-3xl px-5 py-24 text-center sm:px-8 sm:py-32">
      <h2 className="font-display text-4xl font-medium tracking-tight sm:text-5xl">
        Hear how she takes a booking.
      </h2>
      <p className="mx-auto mt-5 max-w-lg text-[1.05rem] leading-relaxed text-muted">
        Talk to Brisa as a guest would — a weekend with a sea view, dinner on Saturday, whether
        the pool is still open.
      </p>
      <div className="mt-8 flex justify-center">
        <Button size="lg" onClick={onTalk}>
          Talk to Brisa
        </Button>
      </div>
    </section>
  );
}
