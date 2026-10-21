"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./CityScene.module.css";
import { COLUMNS, ROWS, composeStreetFrame } from "./cityAnimation";


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
    const columns = COLUMNS, rows = ROWS;
    const plate = new Image(), car = new Image();
    const scene = document.createElement("canvas");
    scene.width = columns * 4; scene.height = rows * 4;
    const sceneContext = scene.getContext("2d", { willReadFrequently: true });
    const sample = document.createElement("canvas"); sample.width = columns; sample.height = rows;
    const sampleContext = sample.getContext("2d", { willReadFrequently: true });
    let ready = false;
    let frame, visible = false, last = 0, previous = 0, elapsed = 0, alive = true;
    plate.src = "/media/city/dc-street-plate.png"; car.src = "/media/city/dc-sedan.png";
    Promise.all([plate.decode(), car.decode()]).then(() => { ready = true; }).catch(() => { if (alive) setFailed(true); });
    const draw = now => {
      if (!alive) return;
      const delta = previous ? Math.min(now - previous, 100) : 0;
      previous = now;
      if (visible && !document.hidden && !motion.matches && ready) elapsed += delta;
      if (visible && ready && now - last >= 50) {
        last = now;
        composeStreetFrame(sceneContext, plate, car, elapsed / 1000, scene.width, scene.height);
        sampleContext.drawImage(scene, 0, 0, columns, rows);
        const pixels = sampleContext.getImageData(0, 0, columns, rows).data;
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
          const i = (y * columns + x) * 4;
          context.fillStyle = `rgb(${pixels[i]},${pixels[i + 1]},${pixels[i + 2]})`;
          context.beginPath(); context.arc((x + .5) * step, (y + .5) * step, step * .46, 0, Math.PI * 2); context.fill();
        }
      }
      frame = requestAnimationFrame(draw);
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { threshold: .05 });
    observer.observe(rootRef.current);
    frame = requestAnimationFrame(draw);
    return () => {
      alive = false; cancelAnimationFrame(frame); observer.disconnect();
    };
  }, []);

  return <section ref={rootRef} className={styles.scene} aria-label="Animated Washington DC photograph with current local weather">
    <div className={`${styles.visual} ${styles.dark}`}>
      <canvas ref={canvasRef} className={styles.canvas} role="img" aria-label="Animated Washington DC dot scene with multi-lane traffic, cyclists, pedestrians, swaying leaves and a traffic-signal countdown" />
      {failed && <p className={styles.error}>The scene could not load. Please refresh to try again.</p>}
    </div>
    <div className={styles.details}>
      <p className={styles.location}>Washington, D.C.</p>
      <p className={styles.note}>Animated photograph · simulated motion</p>
      <p className={styles.note}>{clock || "Washington local time"} ET</p>
      <div className={styles.weather} aria-label="Current Washington DC weather, separate from recorded footage">
        <span>Current weather</span>
        {weather && <><span>{weather.description} · {Math.round(weather.temperature)}°F</span><span>Wind {Math.round(weather.wind)} mph</span></>}
        {weatherError ? <span>{weather ? "Update unavailable; showing last result" : "Temporarily unavailable"}</span> : !weather && <span>Loading…</span>}
      </div>
    </div>
  </section>;
}
