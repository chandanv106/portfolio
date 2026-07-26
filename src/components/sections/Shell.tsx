"use client";

import { motion } from "framer-motion";

type Props = {
  id: string;
  service: string;
  title: string;
  align?: "left" | "right" | "center";
  wide?: boolean;
  children: React.ReactNode;
};

// Shared wrapper for every section: full-viewport, with the content card
// pushed to the side opposite the section's 3D node.
export default function Shell({
  id,
  service,
  title,
  align = "center",
  wide = false,
  children,
}: Props) {
  const justify =
    align === "left"
      ? "justify-start"
      : align === "right"
      ? "justify-end"
      : "justify-center";

  return (
    <section
      id={id}
      className="relative z-10 flex min-h-screen items-center px-4 py-28 sm:px-6"
    >
      <div className={`mx-auto flex w-full max-w-6xl ${justify}`}>
        <motion.div
          initial={{ opacity: 0, y: 44 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.25 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={`panel w-full rounded-sm p-6 sm:p-8 ${
            wide ? "max-w-4xl" : "max-w-xl"
          }`}
        >
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <span className="service-tag">{service}</span>
            <span className="flex items-center gap-1.5 font-mono text-[10px] tracking-widest text-ok">
              <span className="status-dot" /> HEALTHY
            </span>
          </div>
          <h2 className="mb-6 text-3xl font-semibold tracking-tight sm:text-4xl">
            {title}
          </h2>
          {children}
        </motion.div>
      </div>
    </section>
  );
}
