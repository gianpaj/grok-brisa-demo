import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export type WaveState = "idle" | "guest" | "brisa" | "listening";

type WaveformProps = {
  state: WaveState;
  analyser: AnalyserNode | null;
  className?: string;
};

function readToken(name: string, fallback: string) {
  if (typeof window === "undefined") return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

function withAlpha(color: string, alpha: number) {
  const a = Math.max(0, Math.min(1, alpha));
  const hex = color.replace("#", "").trim();
  if (hex.length === 6 && /^[0-9a-fA-F]+$/.test(hex)) {
    const r = Number.parseInt(hex.slice(0, 2), 16);
    const g = Number.parseInt(hex.slice(2, 4), 16);
    const b = Number.parseInt(hex.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }
  return color;
}

export function Waveform({ state, analyser, className }: WaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef(state);
  const analyserRef = useRef(analyser);
  stateRef.current = state;
  analyserRef.current = analyser;

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const ctx2d = canvas.getContext("2d");
    if (!ctx2d) return;

    const freq = new Uint8Array(analyserRef.current?.frequencyBinCount ?? 128);
    let raf = 0;
    let running = true;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = () => {
      const size = wrap.clientWidth;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(size * dpr);
      canvas.height = Math.floor(size * dpr);
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;
      ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    resize();

    const draw = (now: number) => {
      if (!running) return;
      const size = wrap.clientWidth;
      const cx = size / 2;
      const cy = size / 2;
      const t = now / 1000;
      const mode = stateRef.current;
      const node = analyserRef.current;

      let energy = 0.12;
      if (node) {
        node.getByteFrequencyData(freq);
        let sum = 0;
        const n = Math.min(freq.length, 48);
        for (let i = 0; i < n; i++) sum += freq[i];
        energy = Math.min(1, (sum / (n * 255)) * 2.4);
      } else if (mode === "brisa") {
        energy = 0.55 + Math.sin(t * 5.2) * 0.16 + Math.sin(t * 2.1) * 0.1;
      } else if (mode === "guest") {
        energy = 0.38 + Math.sin(t * 7.4) * 0.12 + Math.sin(t * 3.3) * 0.08;
      } else if (mode === "listening") {
        energy = 0.26 + Math.sin(t * 2.4) * 0.06;
      } else {
        energy = 0.16 + Math.sin(t * 1.15) * 0.05;
      }

      if (reduced) energy = mode === "idle" ? 0.14 : 0.36;

      const ink = readToken("--color-fg", "#1c1814");
      const wave = readToken("--color-wave", "#2f6b5d");
      const warm = readToken("--color-wave-warm", "#a56a4a");
      const sand = readToken("--color-sand", "#e8dfd0");
      const stroke = mode === "guest" ? warm : wave;

      ctx2d.clearRect(0, 0, size, size);

      const glow = ctx2d.createRadialGradient(cx, cy, size * 0.05, cx, cy, size * 0.5);
      glow.addColorStop(0, withAlpha(stroke, 0.22 + energy * 0.22));
      glow.addColorStop(0.5, withAlpha(stroke, 0.07));
      glow.addColorStop(1, withAlpha(sand, 0));
      ctx2d.fillStyle = glow;
      ctx2d.beginPath();
      ctx2d.arc(cx, cy, size * 0.5, 0, Math.PI * 2);
      ctx2d.fill();

      ctx2d.beginPath();
      ctx2d.arc(cx, cy, size * 0.46, 0, Math.PI * 2);
      ctx2d.strokeStyle = withAlpha(stroke, 0.12);
      ctx2d.lineWidth = 1;
      ctx2d.stroke();

      const rings = 8;
      for (let i = 0; i < rings; i++) {
        const base = size * (0.08 + i * 0.046);
        const amp = (3.4 + i * 2.1) * energy * (mode === "idle" ? 0.55 : 1);
        const freqN = 3 + (i % 3);
        const phase = t * (0.7 + i * 0.18) + i * 0.4;
        ctx2d.beginPath();
        const steps = 180;
        for (let s = 0; s <= steps; s++) {
          const theta = (s / steps) * Math.PI * 2;
          const wobble =
            Math.sin(theta * freqN + phase) * amp +
            Math.sin(theta * (freqN + 2) - phase * 0.7) * amp * 0.35;
          const r = base + wobble;
          const x = cx + Math.cos(theta) * r;
          const y = cy + Math.sin(theta) * r;
          if (s === 0) ctx2d.moveTo(x, y);
          else ctx2d.lineTo(x, y);
        }
        ctx2d.closePath();
        ctx2d.strokeStyle = withAlpha(stroke, 0.22 + (i / rings) * 0.32 + energy * 0.22);
        ctx2d.lineWidth = i === rings - 1 ? 1.6 : 1.15;
        ctx2d.stroke();
      }

      if (mode !== "idle" && energy > 0.16) {
        const ticks = 56;
        const inner = size * 0.405;
        const outer = size * 0.455;
        for (let i = 0; i < ticks; i++) {
          const theta = (i / ticks) * Math.PI * 2 + t * 0.08;
          const bin = freq[i % freq.length] ?? 90;
          const h = ((bin / 255) * 0.75 + energy * 0.45) * (outer - inner);
          ctx2d.beginPath();
          ctx2d.moveTo(cx + Math.cos(theta) * inner, cy + Math.sin(theta) * inner);
          ctx2d.lineTo(
            cx + Math.cos(theta) * (inner + h),
            cy + Math.sin(theta) * (inner + h),
          );
          ctx2d.strokeStyle = withAlpha(stroke, 0.28 + energy * 0.3);
          ctx2d.lineWidth = 1.25;
          ctx2d.stroke();
        }
      }

      const core = size * (0.042 + energy * 0.032);
      ctx2d.beginPath();
      ctx2d.arc(cx, cy, core, 0, Math.PI * 2);
      ctx2d.fillStyle = withAlpha(stroke, 0.92);
      ctx2d.fill();
      ctx2d.beginPath();
      ctx2d.arc(cx, cy, core * 0.4, 0, Math.PI * 2);
      ctx2d.fillStyle = withAlpha(ink, 0.1);
      ctx2d.fill();

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className={cn("relative aspect-square w-full", className)}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="block size-full" />
    </div>
  );
}
