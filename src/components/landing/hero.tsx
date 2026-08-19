import { useEffect, useRef, useState } from "react";
import { DEMO_SCRIPT, estimateSpeechMs, type ScriptLine } from "@/lib/brisa/script";
import { Button } from "@/components/ui/button";
import { Waveform, type WaveState } from "./waveform";
import { TalkPanel } from "./talk-panel";

type HeroProps = {
  talking: boolean;
  onTalkChange: (open: boolean) => void;
};

export function Hero({ talking, onTalkChange }: HeroProps) {
  const [index, setIndex] = useState(0);
  const [waveState, setWaveState] = useState<WaveState>("idle");
  const cancelRef = useRef(0);

  const line = DEMO_SCRIPT[index] ?? DEMO_SCRIPT[0];
  const paused = talking;

  useEffect(() => {
    if (paused) {
      setWaveState("idle");
      return;
    }

    const token = ++cancelRef.current;
    let timer = 0;
    const lineNow: ScriptLine = DEMO_SCRIPT[index];

    const run = async () => {
      setWaveState(lineNow.speaker === "brisa" ? "brisa" : "guest");
      await wait(estimateSpeechMs(lineNow.text));
      if (token !== cancelRef.current) return;
      setWaveState("idle");
      timer = window.setTimeout(() => {
        if (token !== cancelRef.current) return;
        setIndex((i) => (i + 1) % DEMO_SCRIPT.length);
      }, 700);
    };

    void run();
    return () => {
      window.clearTimeout(timer);
    };
  }, [index, paused]);

  useEffect(() => {
    return () => {
      cancelRef.current += 1;
    };
  }, []);

  return (
    <section className="relative flex min-h-[calc(100svh-4.5rem)] flex-col items-center justify-center px-5 pb-14 pt-6 sm:px-8">
      <div className="hero-grain" aria-hidden="true" />
      <div className="flex w-full max-w-xl flex-col items-center text-center">
        <p className="mb-6 text-[0.7rem] font-medium uppercase tracking-[0.22em] text-muted">
          Voice receptionist for hotels
        </p>

        <div className="relative w-[min(100%,26rem)] sm:w-[30rem]">
          <Waveform state={waveState} analyser={null} />
        </div>

        <div className="mt-2 min-h-[8.5rem] w-full max-w-lg">
          {talking ? (
            <TalkPanel onClose={() => onTalkChange(false)} onState={setWaveState} />
          ) : (
            <Caption line={line} />
          )}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <Button
            variant={talking ? "outline" : "primary"}
            size="sm"
            onClick={() => onTalkChange(!talking)}
          >
            {talking ? "Close" : "Talk to Brisa"}
          </Button>
        </div>
      </div>
    </section>
  );
}

function Caption({ line }: { line: ScriptLine }) {
  return (
    <div key={line.id} className="animate-[caption-in_420ms_ease-out]">
      <p className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-muted">
        {line.speaker === "brisa" ? "Brisa" : "Guest"}
      </p>
      <p className="mt-2 font-display text-[1.35rem] leading-snug text-fg italic sm:text-[1.55rem]">
        “{line.text}”
      </p>
    </div>
  );
}

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}
