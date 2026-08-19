import { Wordmark } from "./wordmark";
import { Button } from "@/components/ui/button";

type NavProps = {
  onTalk: () => void;
};

export function Nav({ onTalk }: NavProps) {
  return (
    <header className="sticky top-0 z-20 bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:h-[4.5rem] sm:px-8">
        <Wordmark />
        <nav className="hidden items-center gap-8 text-sm text-muted md:flex">
          <a href="#how" className="transition-colors hover:text-fg">
            How it works
          </a>
          <a href="#handles" className="transition-colors hover:text-fg">
            What she handles
          </a>
          <a href="#hotels" className="transition-colors hover:text-fg">
            For hotels
          </a>
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <Button size="sm" onClick={onTalk}>
            Talk to Brisa
          </Button>
        </div>
      </div>
    </header>
  );
}
