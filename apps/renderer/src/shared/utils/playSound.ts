const lastPlayed: Record<string, number> = {};
const DEFAULT_INTERVAL = 800;

type SoundName = "success" | "error";

export function playSound(
  name: SoundName,
  opts?: { intervalMs?: number; volume?: number }
) {
  const now = Date.now();
  const interval = opts?.intervalMs ?? DEFAULT_INTERVAL;

  if (lastPlayed[name] && now - lastPlayed[name] < interval) {
    return;
  }
  lastPlayed[name] = now;

  const audio = new Audio(`/sounds/${name}.mp3`);
  if (opts?.volume != null) audio.volume = opts.volume;
  else audio.volume = 0.3;

  audio.play().catch(() => {});
}
