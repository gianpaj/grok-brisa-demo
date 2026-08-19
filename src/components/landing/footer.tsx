import { Wordmark } from "./wordmark";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-5 py-10 sm:flex-row sm:items-center sm:px-8">
        <div>
          <Wordmark />
          <p className="mt-2 text-sm text-muted">The voice at the desk.</p>
        </div>
        <p className="text-sm text-muted">© {new Date().getFullYear()} HelloBrisa</p>
      </div>
    </footer>
  );
}
