import { cn } from "@/lib/utils";

export function Wordmark({ className }: { className?: string }) {
  return (
    <a href="/" className={cn("inline-flex items-baseline text-fg no-underline", className)}>
      <span className="font-sans text-[0.95rem] font-medium tracking-tight">Hello</span>
      <span className="font-display text-[1.15rem] italic font-medium tracking-tight">Brisa</span>
    </a>
  );
}
