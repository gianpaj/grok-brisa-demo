export type Speaker = "guest" | "brisa";

export type ScriptLine = {
  id: string;
  speaker: Speaker;
  text: string;
};

/** Scripted booking call — visual demo (no audio assets in this export). */
export const DEMO_SCRIPT: ScriptLine[] = [
  {
    id: "g1",
    speaker: "guest",
    text: "Hi — I'd like a room for two this weekend. Somewhere quiet, with a sea view if you have it.",
  },
  {
    id: "b1",
    speaker: "brisa",
    text: "Good evening. I have a terrace suite free Friday through Sunday — west-facing, two nights, breakfast included. Shall I hold it?",
  },
  {
    id: "g2",
    speaker: "guest",
    text: "What's included? And is there a pool?",
  },
  {
    id: "b2",
    speaker: "brisa",
    text: "The infinity pool is open until ten, and the spa from seven. I can add a table at the terrace restaurant for Saturday at eight, if you'd like.",
  },
  {
    id: "g3",
    speaker: "guest",
    text: "Perfect. Book it — and yes to dinner.",
  },
  {
    id: "b3",
    speaker: "brisa",
    text: "Done. Your confirmation is on its way, and I'll have the room ready. Is there anything else I can arrange?",
  },
];

export function estimateSpeechMs(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1800, Math.min(8200, words * 380 + 500));
}
