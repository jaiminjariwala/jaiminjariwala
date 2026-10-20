"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./CityScene.module.css";

const weatherLabel = code => code === 0 ? "Clear" : code <= 3 ? "Cloudy" : code <= 48 ? "Fog" : code <= 67 ? "Rain" : code <= 77 ? "Snow" : code <= 82 ? "Showers" : code <= 86 ? "Snow showers" : "Thunderstorms";

export default function CityScene() {
  const rootRef = useRef(null), canvasRef = useRef(null), videoRef = useRef(null);
  const [density, setDensity] = useState(80);
  const [backdrop, setBackdrop] = useState(false);
  const [paused, setPaused] = useState(false);
  const [blocked, setBlocked] = useState(false);
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
    const video = videoRef.current, canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const sample = document.createElement("canvas");
    const sampleContext = sample.getContext("2d", { willReadFrequently: true });
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let frame, visible = false, last = 0, alive = true;
    const draw = now => {
      if (!alive) return;
      if (visible && video.readyState >= 2 && now - last >= 66) {
        last = now;
        const columns = density, rows = Math.round(columns * video.videoHeight / video.videoWidth);
        sample.width = columns; sample.height = rows;
        sampleContext.drawImage(video, 0, 0, columns, rows);
        const pixels = sampleContext.getImageData(0, 0, columns, rows).data;
        const width = canvas.clientWidth, height = width * rows / columns;
        const ratio = Math.min(devicePixelRatio || 1, 2);
        if (canvas.width !== Math.round(width * ratio) || canvas.height !== Math.round(height * ratio)) {
          canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
        }
        context.setTransform(ratio, 0, 0, ratio, 0, 0);
        context.clearRect(0, 0, width, height);
        const step = width / columns;
        for (let y = 0; y < rows; y++) for (let x = 0; x < columns; x++) {
          const i = (y * columns + x) * 4;
          context.fillStyle = `rgb(${pixels[i]},${pixels[i + 1]},${pixels[i + 2]})`;
          context.beginPath(); context.arc((x + .5) * step, (y + .5) * step, step * .46, 0, Math.PI * 2); context.fill();
        }
      }
      frame = requestAnimationFrame(draw);
    };
    const sync = () => {
      if (visible && !paused && !document.hidden && !motion.matches) video.play().then(() => { if (alive) setBlocked(false); }).catch(() => { if (alive) setBlocked(true); });
      else video.pause();
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }, { threshold: .05 });
    observer.observe(rootRef.current);
    video.addEventListener("loadeddata", sync);
    document.addEventListener("visibilitychange", sync);
    motion.addEventListener("change", sync);
    frame = requestAnimationFrame(draw);
    return () => {
      alive = false; cancelAnimationFrame(frame); observer.disconnect(); video.pause();
      video.removeEventListener("loadeddata", sync); document.removeEventListener("visibilitychange", sync); motion.removeEventListener("change", sync);
    };
  }, [density, paused]);

  const togglePlayback = () => {
    if (blocked) videoRef.current.play().then(() => { setBlocked(false); setPaused(false); }).catch(() => setBlocked(true));
    else setPaused(value => !value);
  };

  return <section ref={rootRef} className={styles.scene} aria-label="Georgetown recorded city scene with current Washington DC weather">
    <div className={`${styles.visual} ${backdrop ? styles.dark : ""}`}>
      <video ref={videoRef} className={styles.source} src="/media/city/georgetown.mp4" poster="/media/city/georgetown-poster.png" muted loop playsInline preload="auto" aria-hidden="true" onError={() => setFailed(true)} />
      <canvas ref={canvasRef} className={styles.canvas} role="img" aria-label="Moving colored dots depicting Jaimin’s recorded Georgetown street footage" />
      {failed && <p className={styles.error}>The recorded scene could not load. Please refresh to try again.</p>}
    </div>
    <div className={styles.details}>
      <p className={styles.location}>Georgetown<br />Washington, D.C.</p>
      <p className={styles.note}>Recorded footage · by Jaimin</p>
      <div className={styles.controls}>
        <button type="button" onClick={togglePlayback}>{blocked || paused ? "Play" : "Pause"} <span aria-hidden="true">{blocked || paused ? "▷" : "Ⅱ"}</span></button>
        <button type="button" onClick={() => setDensity(value => value === 80 ? 112 : value === 112 ? 56 : 80)}>Dots <span>{density}</span></button>
        <button type="button" aria-pressed={backdrop} onClick={() => setBackdrop(value => !value)}>Backdrop <span aria-hidden="true">{backdrop ? "◼" : "□"}</span></button>
      </div>
      <p className={styles.note}>{clock || "Washington local time"} ET</p>
      <div className={styles.weather} aria-label="Current Washington DC weather, separate from recorded footage">
        <span>Current weather</span>
        {weather && <><span>{weatherLabel(weather.code)} · {Math.round(weather.temperature)}°F</span><span>Wind {Math.round(weather.wind)} mph</span></>}
        {weatherError ? <span>{weather ? "Update unavailable; showing last result" : "Temporarily unavailable"}</span> : !weather && <span>Loading…</span>}
      </div>
      <a className={styles.credit} href="https://open-meteo.com/" target="_blank" rel="noreferrer">Weather by Open-Meteo</a>
    </div>
  </section>;
}
