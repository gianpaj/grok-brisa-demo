export type Speaker = "guest" | "brisa";

export type ScriptLine = {
  id: string;
  speaker: Speaker;
  text: string;
  audio: string;
};

export const DEMO_SCRIPT: ScriptLine[] = [
  {
    id: "g1",
    speaker: "guest",
    text: "Hi — I'd like a room for two this weekend. Somewhere quiet, with a sea view if you have it.",
    audio: "/audio/guest-1.mp3",
  },
  {
    id: "b1",
    speaker: "brisa",
    text: "Good evening. I have a terrace suite free Friday through Sunday — west-facing, two nights, breakfast included. Shall I hold it?",
    audio: "/audio/brisa-1.mp3",
  },
  {
    id: "g2",
    speaker: "guest",
    text: "What's included? And is there a pool?",
    audio: "/audio/guest-2.mp3",
  },
  {
    id: "b2",
    speaker: "brisa",
    text: "The infinity pool is open until ten, and the spa from seven. I can add a table at the terrace restaurant for Saturday at eight, if you'd like.",
    audio: "/audio/brisa-2.mp3",
  },
  {
    id: "g3",
    speaker: "guest",
    text: "Perfect. Book it — and yes to dinner.",
    audio: "/audio/guest-3.mp3",
  },
  {
    id: "b3",
    speaker: "brisa",
    text: "Done. Your confirmation is on its way, and I'll have the room ready. Is there anything else I can arrange?",
    audio: "/audio/brisa-3.mp3",
  },
];

export function estimateSpeechMs(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1800, Math.min(8200, words * 380 + 500));
}
