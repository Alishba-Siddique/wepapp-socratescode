"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
export function Mark() {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path
        d="m10 15-7 9 7 9m28-18 7 9-7 9M15 12h18v4H15zM18 17v16m6-16v16m6-16v16M16 34h16v3H16zM13 39h22"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}
export function Shell({ children }: { children: ReactNode }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const navigation = useRef<HTMLElement>(null);
  const menu = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (open) navigation.current?.querySelector<HTMLAnchorElement>("nav a")?.focus();
  }, [open]);
  const links = [
    { href: "/", label: "Overview", symbol: "01" },
    { href: "/curriculum", label: "Learning path", symbol: "02" },
    { href: "/progress", label: "My progress", symbol: "03" },
    { href: "/patterns", label: "Pattern library", symbol: "04" },
  ];
  return (
    <div className="app-shell" onKeyDown={(event) => {
      if (event.key === "Escape" && open) { setOpen(false); menu.current?.focus(); }
    }}>
      <a className="skip-link" href="#content">
        Skip to content
      </a>
      <aside id="workspace-navigation" ref={navigation} className={"sidebar " + (open ? "is-open" : "")}>
        <Link prefetch={false} href="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-mark">
            <Mark />
          </span>
          socratescode
        </Link>
        <p className="sidebar-label">YOUR THINKING SPACE</p>
        <nav aria-label="Workspace navigation">
          {links.map((link) => (
            <Link prefetch={false}
              key={link.href}
              href={link.href}
              aria-current={
                path === link.href ||
                (link.href === "/curriculum" && path.startsWith("/learn/"))
                  ? "page"
                  : undefined
              }
              onClick={() => setOpen(false)}
            >
              <span>{link.symbol}</span>
              {link.label}
              <span className="nav-arrow" aria-hidden="true">
                &#8594;
              </span>
            </Link>
          ))}
        </nav>
        <div className="sidebar-note">
          <span>THE SOCRATIC WAY</span>
          <p>
            A better question.
            <br />A clearer mind.
          </p>
          <small>Progress begins with understanding.</small>
        </div>
        <div className="guest-profile">
          <span className="guest-avatar">G</span>
          <div>
            Guest workspace<small>Learning at your own pace</small>
          </div>
        </div>
      </aside>
      <div className="app-main">
        <header className="topbar">
          <button
            ref={menu}
            className="menu-button"
            aria-controls="workspace-navigation"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
          >
            &#9776;
          </button>
          <span>
            THE LEARNING LAB <span className="topbar-separator">/</span>{" "}
            <strong>
              {path.startsWith("/learn/")
                ? "Practice"
                : links.find((link) => link.href === path)?.label ||
                  "Workspace"}
            </strong>
          </span>
          <span className="guest-badge">
            <i /> GUEST EDITION
          </span>
        </header>
        <main id="content" tabIndex={-1}>
          {children}
        </main>
      </div>
    </div>
  );
}
