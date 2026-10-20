"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./CityScene.module.css";


export default function CityScene() {
  const rootRef = useRef(null), canvasRef = useRef(null);
  const [failed, setFailed] = useState(false);
  const [clock, setClock] = useState("");
  const [weather, setWeather] = useState(null);
  const [weatherError, setWeatherError] = useState(false);

  useEffect(() => {
    const update = () => setClock(new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date()));
    update();
    const timer = setInterval(update, 30000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const update = async () => {
      try {
        const response = await fetch("/api/dc-weather", { signal: controller.signal });
        if (!response.ok) throw new Error("Weather unavailable");
        setWeather(await response.json()); setWeatherError(false);
      } catch { if (!controller.signal.aborted) setWeatherError(true); }
    };
    update();
    const timer = setInterval(update, 600000);
    return () => { controller.abort(); clearInterval(timer); };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const controller = new AbortController();
    let pixels, columns, rows, fps, count;
    let frame, visible = false, last = 0, previous = 0, elapsed = 0, alive = true;
    fetch("/media/city/georgetown-frames.bin", { signal: controller.signal }).then(response => {
      if (!response.ok) throw new Error("Scene unavailable");
      return response.arrayBuffer();
    }).then(buffer => {
      const header = new DataView(buffer);
      columns = header.getUint32(0, true); rows = header.getUint32(4, true);
      fps = header.getUint32(8, true); count = header.getUint32(12, true);
      if (!columns || !rows || !fps || count < 2 || buffer.byteLength !== 16 + columns * rows * 3 * count) throw new Error("Invalid scene frames");
      pixels = new Uint8Array(buffer, 16);
    }).catch(() => { if (alive) setFailed(true); });
    const draw = now => {
      if (!alive) return;
      const delta = previous ? Math.min(now - previous, 100) : 0;
      previous = now;
      if (visible && !document.hidden && !motion.matches && pixels) elapsed += delta;
      if (visible && pixels && now - last >= 50) {
        last = now;
        // Triangle wave: 0…last…0. Quarter speed, no jump to frame zero.
        const end = count - 1;
        const phase = (elapsed / 1000 * fps * .25) % (2 * end);
        const position = phase <= end ? phase : 2 * end - phase;
        const first = Math.floor(position), second = Math.min(first + 1, end), mix = position - first;
        const frameSize = columns * rows * 3;
        const width = canvas.clientWidth, height = width * rows / columns;
        const ratio = Math.min(devicePixelRatio || 1, 2);
        if (canvas.width !== Math.round(width * ratio) || canvas.height !== Math.round(height * ratio)) {
          canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
        }
        context.setTransform(ratio, 0, 0, ratio, 0, 0);
        context.clearRect(0, 0, width, height);
        const step = width / columns;
        // Backdrop ends at the outer dot centers, never through their circles.
        // Perimeter circles complete its scalloped silhouette instead of a
        // rectangular CSS background clipping the outside dots flat.
        context.fillStyle = "#07130e";
        context.fillRect(step / 2, step / 2, width - step, height - step);
        for (let y = 0; y < rows; y++) for (let x = 0; x < columns; x++) {
          if (x !== 0 && y !== 0 && x !== columns - 1 && y !== rows - 1) continue;
          context.beginPath(); context.arc((x + .5) * step, (y + .5) * step, step * .46, 0, Math.PI * 2); context.fill();
        }
        for (let y = 0; y < rows; y++) for (let x = 0; x < columns; x++) {
          const i = (y * columns + x) * 3;
          const a = first * frameSize + i, b = second * frameSize + i;
          const color = channel => Math.round(pixels[a + channel] * (1 - mix) + pixels[b + channel] * mix);
          context.fillStyle = `rgb(${color(0)},${color(1)},${color(2)})`;
          context.beginPath(); context.arc((x + .5) * step, (y + .5) * step, step * .46, 0, Math.PI * 2); context.fill();
        }
      }
      frame = requestAnimationFrame(draw);
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { threshold: .05 });
    observer.observe(rootRef.current);
    frame = requestAnimationFrame(draw);
    return () => {
      alive = false; controller.abort(); cancelAnimationFrame(frame); observer.disconnect();
    };
  }, []);

  return <section ref={rootRef} className={styles.scene} aria-label="Georgetown recorded city scene with current Washington DC weather">
    <div className={`${styles.visual} ${styles.dark}`}>
      <canvas ref={canvasRef} className={styles.canvas} role="img" aria-label="Moving colored dots depicting Jaimin’s recorded Georgetown street footage" />
      {failed && <p className={styles.error}>The recorded scene could not load. Please refresh to try again.</p>}
    </div>
    <div className={styles.details}>
      <p className={styles.location}>Georgetown<br />Washington, D.C.</p>
      <p className={styles.note}>Recorded footage · by Jaimin</p>
      <p className={styles.note}>{clock || "Washington local time"} ET</p>
      <div className={styles.weather} aria-label="Current Washington DC weather, separate from recorded footage">
        <span>Current weather</span>
        {weather && <><span>{weather.description} · {Math.round(weather.temperature)}°F</span><span>Wind {Math.round(weather.wind)} mph</span></>}
        {weatherError ? <span>{weather ? "Update unavailable; showing last result" : "Temporarily unavailable"}</span> : !weather && <span>Loading…</span>}
      </div>
    </div>
  </section>;
}
