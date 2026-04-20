import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { navContent } from "@/content";
import { useAuth } from "@/lib/auth-context";

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const { user, signOut, loading } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-border/60 bg-background/70 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
        <Link to="/" className="flex items-center gap-2.5 group">
          <span className="relative flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent shadow-glow">
            <Sparkles className="size-4 text-primary-foreground" />
          </span>
          <span className="font-display text-lg font-medium tracking-tight">
            {navContent.brand}
          </span>
        </Link>

        <div className="hidden items-center gap-9 text-sm font-medium text-muted-foreground md:flex">
          {navContent.links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="transition-colors hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {!loading && (
            user ? (
              <button
                onClick={() => signOut()}
                className="inline-flex items-center justify-center rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-glow"
              >
                {navContent.signOut}
              </button>
            ) : (
              <>
                <Link
                  to="/signin"
                  className="hidden rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
                >
                  {navContent.signIn}
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-glow"
                >
                  {navContent.register}
                </Link>
              </>
            )
          )}
        </div>
      </nav>
    </header>
  );
}
