"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Nav from "./Nav";
import BootSequence from "./BootSequence";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Experience from "./sections/Experience";
import Projects from "./sections/Projects";
import Skills from "./sections/Skills";
import Certifications from "./sections/Certifications";
import Contact from "./sections/Contact";
import { sections } from "@/data/resume";

const SystemScene = dynamic(() => import("./three/SystemScene"), {
  ssr: false,
});

type Mode = "loading" | "3d" | "2d";
type Quality = "high" | "low";

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl")
    );
  } catch {
    return false;
  }
}

export default function PortfolioApp() {
  const [mode, setMode] = useState<Mode>("loading");
  const [quality, setQuality] = useState<Quality>("high");
  const [activeIndex, setActiveIndex] = useState(0);
  const progressRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const activeRef = useRef(0);

  // Decide 3D vs 2D once on mount: phones and reduced-motion visitors get
  // the lightweight 2D version; tablets get 3D at reduced quality.
  useEffect(() => {
    const smallScreen = window.matchMedia("(max-width: 767px)").matches;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const lowPower =
      window.matchMedia("(max-width: 1100px)").matches ||
      (navigator.hardwareConcurrency ?? 8) <= 4;
    setQuality(lowPower ? "low" : "high");
    setMode(!smallScreen && !reducedMotion && supportsWebGL() ? "3d" : "2d");
  }, []);

  // Scroll progress (0..1 across the whole document) drives the camera.
  useEffect(() => {
    const segCount = sections.length - 1;
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      progressRef.current = p;
      const idx = Math.min(segCount, Math.round(p * segCount));
      if (idx !== activeRef.current) {
        activeRef.current = idx;
        setActiveIndex(idx);
      }
    };
    const onMouse = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMouse, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  return (
    <div className="relative">
      <BootSequence />

      {/* backdrop: live 3D system, or the lightweight 2D grid fallback */}
      {mode === "3d" ? (
        <SystemScene
          progressRef={progressRef}
          mouseRef={mouseRef}
          activeIndex={activeIndex}
          quality={quality}
        />
      ) : (
        <div className="fixed inset-0 z-0">
          <div className="fallback-grid absolute inset-0" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_30%,rgba(34,211,238,0.08),transparent_70%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_35%_at_70%_75%,rgba(167,139,250,0.06),transparent_70%)]" />
        </div>
      )}

      <Nav activeIndex={activeIndex} />

      <main className="relative z-10">
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Certifications />
        <Contact />
      </main>
    </div>
  );
}
