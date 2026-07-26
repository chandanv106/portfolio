import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="fallback-grid absolute inset-0" />
      <div className="relative">
        <p className="font-mono text-xs tracking-[0.3em] text-neon">
          // ROUTE NOT REGISTERED
        </p>
        <h1 className="mt-4 font-mono text-6xl font-bold text-fg sm:text-7xl">404</h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
          The service you requested isn&apos;t in the registry. Eureka has no
          instance registered at this path.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-sm border border-neon bg-neon/10 px-6 py-2.5 font-mono text-sm text-neon transition-all hover:bg-neon/20"
        >
          ← route back to gateway
        </Link>
      </div>
    </main>
  );
}
