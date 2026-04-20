import { footerContent, navContent } from "@/content";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 px-6 py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-sm text-muted-foreground sm:flex-row">
        <p>
          &copy; {new Date().getFullYear()} {navContent.brand}. {footerContent.copyright}
        </p>
        <div className="flex items-center gap-6">
          {footerContent.links.map((l) => (
            <a key={l.label} href={l.href} className="hover:text-foreground transition-colors">
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
