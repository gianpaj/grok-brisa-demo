import { terraceJpg } from "../../lib/img-terrace";
import { lobbyJpg } from "../../lib/img-lobby";
import { breezeJpg } from "../../lib/img-breeze";

export function Moments() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
      <figure className="overflow-hidden rounded-[1.75rem] bg-sand shadow-[var(--shadow-border)]">
        <img
          src={terraceJpg}
          alt="Morning light on a quiet Mediterranean hotel terrace"
          className="aspect-[16/9] w-full object-cover"
        />
      </figure>
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <figure className="overflow-hidden rounded-[1.5rem] bg-sand shadow-[var(--shadow-border)]">
          <img
            src={lobbyJpg}
            alt="An empty boutique hotel reception in morning light"
            className="aspect-[3/2] w-full object-cover"
          />
        </figure>
        <figure className="overflow-hidden rounded-[1.5rem] bg-sand shadow-[var(--shadow-border)]">
          <img
            src={breezeJpg}
            alt="Linen curtains lifting in a breeze at an open terrace door"
            className="aspect-[3/2] w-full object-cover"
          />
        </figure>
      </div>
      <p className="mx-auto mt-10 max-w-2xl text-center font-display text-2xl italic leading-snug text-fg sm:text-3xl">
        Built for houses that still believe the first voice matters.
      </p>
    </section>
  );
}
