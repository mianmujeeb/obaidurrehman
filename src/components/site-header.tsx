"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { ArrowRightIcon, CaretDownIcon, CubeIcon, ListIcon, XIcon } from "@phosphor-icons/react";
import { doctor } from "@/lib/doctor";
import { treatments } from "@/lib/treatments";
import { cn } from "@/lib/utils";
import { LogoTile } from "./brand-mark";
import { BookButton } from "./booking";
import { InstallButton } from "./pwa/install";
import { ThemeButton } from "./theme-toggle";
import { TreatmentIcon } from "./treatment-icon";

/** Top-level areas of the site, in navigation order. */
export type SiteArea = "home" | "about" | "treatments" | "reviews" | "contact";
const ORDER: SiteArea[] = ["home", "about", "treatments", "reviews", "contact"];

const PAGES: { id: Exclude<SiteArea, "home" | "treatments">; href: string; label: string }[] = [
  { id: "about", href: "/about", label: "About" },
  { id: "reviews", href: "/reviews", label: "Reviews & FAQs" },
  { id: "contact", href: "/contact", label: "Contact" },
];

/** Pages slide left when moving forward through the nav order, right when moving back. */
function direction(from: SiteArea, to: SiteArea) {
  return ORDER.indexOf(to) >= ORDER.indexOf(from) ? "nav-forward" : "nav-back";
}

/** Links into the home page scroll in place when already there. */
function HomeLink({
  current,
  hash,
  className,
  onClick,
  children,
}: {
  current: SiteArea;
  hash: string;
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  if (current === "home") {
    return (
      <a href={hash} className={className} onClick={onClick}>
        {children}
      </a>
    );
  }
  return (
    <Link href={`/${hash}`} transitionTypes={["nav-back"]} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}

const linkBase = "rounded-full px-3.5 py-2 text-sm transition-colors hover:bg-surface-2 hover:text-ink";

export function SiteHeader({ current = "home" }: { current?: SiteArea }) {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 16));

  useEffect(() => {
    document.documentElement.style.overflow = menuOpen ? "hidden" : "";
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const close = () => setMenuOpen(false);

  return (
    <header className="fixed inset-x-0 top-0 z-40" style={{ viewTransitionName: "site-header" }}>
      <div
        className={cn(
          "transition-[background-color,border-color,backdrop-filter] duration-500",
          scrolled || menuOpen ? "glass border-b border-line" : "border-b border-transparent",
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:h-[72px] md:px-8">
          <HomeLink current={current} hash="#top" className="flex items-center gap-3" onClick={close}>
            <LogoTile className="size-9" />
            <span className="leading-tight">
              <span className="block whitespace-nowrap text-[15px] font-semibold">{doctor.name}</span>
              <span className="block text-xs text-muted">Urologist, {doctor.city}</span>
            </span>
          </HomeLink>

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              <li>
                <PageLink page={PAGES[0]} current={current} />
              </li>
              <TreatmentsMenu current={current} />
              {PAGES.slice(1).map((p) => (
                <li key={p.id}>
                  <PageLink page={p} current={current} />
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <ThemeButton />
            <InstallButton className="hidden lg:inline-flex" />
            <BookButton className="hidden md:inline-flex" />
            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((v) => !v)}
              className="grid size-11 place-items-center rounded-full border border-line text-ink lg:hidden"
            >
              {menuOpen ? <XIcon size={20} aria-hidden /> : <ListIcon size={20} aria-hidden />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && <MobileMenu current={current} onNavigate={close} />}
      </AnimatePresence>
    </header>
  );
}

function PageLink({ page, current }: { page: (typeof PAGES)[number]; current: SiteArea }) {
  const here = page.id === current;
  return (
    <Link
      href={page.href}
      transitionTypes={[direction(current, page.id)]}
      aria-current={here ? "page" : undefined}
      className={cn(linkBase, here ? "font-medium text-ink" : "text-muted")}
    >
      {page.label}
    </Link>
  );
}

/**
 * Disclosure-style dropdown listing every treatment guide. Opens on hover for
 * mice, on click or Enter for everyone; closes on Escape, outside click or when
 * focus leaves it.
 */
function TreatmentsMenu({ current }: { current: SiteArea }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLLIElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  const here = current === "treatments";

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      buttonRef.current?.focus();
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  function hoverOpen(e: React.PointerEvent) {
    if (e.pointerType !== "mouse") return;
    window.clearTimeout(closeTimer.current);
    setOpen(true);
  }

  function hoverClose(e: React.PointerEvent) {
    if (e.pointerType !== "mouse") return;
    closeTimer.current = window.setTimeout(() => setOpen(false), 160);
  }

  return (
    <li
      ref={wrapRef}
      className="relative"
      onPointerEnter={hoverOpen}
      onPointerLeave={hoverClose}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls="treatments-menu"
        onClick={(e) => {
          // Hover already opened it for mice, so a click shouldn't close it again.
          if ((e.nativeEvent as PointerEvent).pointerType === "mouse") setOpen(true);
          else setOpen((v) => !v);
        }}
        className={cn(linkBase, "inline-flex items-center gap-1", here || open ? "font-medium text-ink" : "text-muted")}
      >
        Treatments
        <CaretDownIcon
          size={14}
          weight="bold"
          aria-hidden
          className={cn("transition-transform duration-300", open && "rotate-180")}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id="treatments-menu"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-1/2 top-full z-50 w-[600px] origin-top -translate-x-1/2 pt-3"
          >
            <div className="overflow-hidden rounded-3xl border border-line bg-surface shadow-soft">
              <ul className="grid grid-cols-2 gap-1 p-2">
                {treatments.map((t) => (
                  <li key={t.slug}>
                    <Link
                      href={`/treatments/${t.slug}`}
                      transitionTypes={["nav-forward"]}
                      onClick={() => setOpen(false)}
                      className="group flex items-start gap-3 rounded-2xl p-3 transition-colors hover:bg-surface-2 focus-visible:bg-surface-2"
                    >
                      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-accent-soft text-accent transition-colors group-hover:bg-accent group-hover:text-accent-ink">
                        <TreatmentIcon kind={t.scene} size={20} />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold text-ink">{t.name}</span>
                        <span className="mt-0.5 line-clamp-2 block text-xs leading-relaxed text-muted">{t.short}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between gap-4 border-t border-line bg-bg/60 px-5 py-3 text-sm">
                <HomeLink
                  current={current}
                  hash="#anatomy"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center gap-2 text-muted transition-colors hover:text-accent"
                >
                  <CubeIcon size={16} aria-hidden />
                  Explore the 3D anatomy
                </HomeLink>
                <HomeLink
                  current={current}
                  hash="#treatments"
                  onClick={() => setOpen(false)}
                  className="group inline-flex items-center gap-1.5 font-semibold text-accent"
                >
                  All treatments
                  <ArrowRightIcon size={14} weight="bold" aria-hidden className="transition-transform group-hover:translate-x-0.5" />
                </HomeLink>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };
const itemTransition = { duration: 0.45, ease: [0.16, 1, 0.3, 1] as const };

function MobileMenu({ current, onNavigate }: { current: SiteArea; onNavigate: () => void }) {
  const big = "block py-4 text-3xl font-semibold tracking-tight";
  return (
    <motion.div
      id="mobile-menu"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-x-0 bottom-0 top-16 overflow-y-auto bg-bg px-4 pb-10 pt-4 md:top-[72px] md:px-8 lg:hidden"
    >
      <nav aria-label="Mobile">
        <motion.ul
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.05 } } }}
          className="divide-y divide-line"
        >
          <motion.li variants={item} transition={itemTransition}>
            <MobilePageLink page={PAGES[0]} current={current} onNavigate={onNavigate} className={big} />
          </motion.li>
          <motion.li variants={item} transition={itemTransition} className="py-4">
            <p className={cn("text-3xl font-semibold tracking-tight", current === "treatments" && "text-accent")}>
              Treatments
            </p>
            <ul className="mt-3 grid gap-1 sm:grid-cols-2">
              {treatments.map((t) => (
                <li key={t.slug}>
                  <Link
                    href={`/treatments/${t.slug}`}
                    transitionTypes={["nav-forward"]}
                    onClick={onNavigate}
                    className="flex items-center gap-3 rounded-2xl py-2.5 pr-3 text-base font-medium transition-colors active:bg-surface-2"
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
                      <TreatmentIcon kind={t.scene} size={18} />
                    </span>
                    {t.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex flex-wrap gap-2">
              <HomeLink
                current={current}
                hash="#treatments"
                onClick={onNavigate}
                className="rounded-full border border-line px-4 py-2 text-sm font-medium"
              >
                All treatments
              </HomeLink>
              <HomeLink
                current={current}
                hash="#anatomy"
                onClick={onNavigate}
                className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm font-medium"
              >
                <CubeIcon size={16} aria-hidden />
                3D anatomy
              </HomeLink>
            </div>
          </motion.li>
          {PAGES.slice(1).map((p) => (
            <motion.li key={p.id} variants={item} transition={itemTransition}>
              <MobilePageLink page={p} current={current} onNavigate={onNavigate} className={big} />
            </motion.li>
          ))}
        </motion.ul>
      </nav>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <BookButton className="py-3.5" />
        <InstallButton className="justify-center py-3" />
      </div>
    </motion.div>
  );
}

function MobilePageLink({
  page,
  current,
  onNavigate,
  className,
}: {
  page: (typeof PAGES)[number];
  current: SiteArea;
  onNavigate: () => void;
  className: string;
}) {
  const here = page.id === current;
  return (
    <Link
      href={page.href}
      transitionTypes={[direction(current, page.id)]}
      onClick={onNavigate}
      aria-current={here ? "page" : undefined}
      className={cn(className, here && "text-accent")}
    >
      {page.label}
    </Link>
  );
}
