import { useEffect, useRef } from "react";
import { useGame } from "@/game/store";

// Synthesized ambient pad — no external assets required.
export function useMusic() {
  const enabled = useGame((s) => s.setup.musicEnabled);
  const volume = useGame((s) => s.setup.musicVolume);
  const ctxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!enabled) {
      if (gainRef.current) gainRef.current.gain.value = 0;
      return;
    }
    const start = () => {
      if (startedRef.current) {
        if (gainRef.current) gainRef.current.gain.value = volume;
        return;
      }
      const Ctx = (window.AudioContext || (window as any).webkitAudioContext) as typeof AudioContext;
      const ctx = new Ctx();
      ctxRef.current = ctx;
      const master = ctx.createGain();
      master.gain.value = volume;
      master.connect(ctx.destination);
      gainRef.current = master;

      // Two slow detuned oscillators + a low drone for cinematic pad
      const freqs = [110, 164.81, 220, 246.94]; // A2, E3, A3, B3
      freqs.forEach((f, i) => {
        const o = ctx.createOscillator();
        o.type = i % 2 === 0 ? "sine" : "triangle";
        o.frequency.value = f;
        const g = ctx.createGain();
        g.gain.value = 0.08;
        // slow LFO on gain
        const lfo = ctx.createOscillator();
        lfo.frequency.value = 0.05 + i * 0.03;
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 0.05;
        lfo.connect(lfoGain).connect(g.gain);
        o.connect(g).connect(master);
        o.start();
        lfo.start();
      });
      startedRef.current = true;
    };
    // browsers require user gesture
    const onGesture = () => {
      start();
      window.removeEventListener("pointerdown", onGesture);
      window.removeEventListener("keydown", onGesture);
    };
    if (startedRef.current) {
      if (gainRef.current) gainRef.current.gain.value = volume;
    } else {
      window.addEventListener("pointerdown", onGesture);
      window.addEventListener("keydown", onGesture);
    }
    return () => {
      window.removeEventListener("pointerdown", onGesture);
      window.removeEventListener("keydown", onGesture);
    };
  }, [enabled, volume]);
}
