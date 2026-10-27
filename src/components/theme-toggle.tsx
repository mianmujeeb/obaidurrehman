"use client";

import { useId } from "react";
import { DesktopIcon, MoonIcon, SunIcon, type Icon } from "@phosphor-icons/react";
import { switchTheme, toggleTheme, useDarkTheme, useRestoreTheme, useThemePref, type ThemePref } from "@/lib/theme";
import { cn } from "@/lib/utils";

// Same values as --bg in globals.css.
const themeColors = { light: "#f2f6f6", dark: "#071011" };

/**
 * Browser and status-bar colour: one per scheme by default, pinned to the chosen
 * palette once the user picks one. React hoists these into <head>. Lives in the
 * root layout, so it also owns restoring the saved theme after hydration.
 */
export function ThemeColor() {
  useRestoreTheme();
  const pref = useThemePref();
  if (pref !== "system") return <meta name="theme-color" content={themeColors[pref]} />;
  return (
    <>
      <meta name="theme-color" media="(prefers-color-scheme: light)" content={themeColors.light} />
      <meta name="theme-color" media="(prefers-color-scheme: dark)" content={themeColors.dark} />
    </>
  );
}

/**
 * Header button that flips between light and dark. The icon is picked by the CSS
 * `dark` variant, so it is right from the first paint, before hydration.
 */
export function ThemeButton({ className }: { className?: string }) {
  const dark = useDarkTheme();
  return (
    <button
      type="button"
      aria-label="Dark mode"
      aria-pressed={dark}
      onClick={(e) => toggleTheme(e.currentTarget)}
      className={cn(
        "grid size-11 place-items-center rounded-full border border-line text-ink transition-colors hover:bg-surface-2 active:scale-[0.96]",
        className,
      )}
    >
      <SunIcon size={20} aria-hidden className="dark:hidden" />
      <MoonIcon size={20} aria-hidden className="hidden dark:block" />
    </button>
  );
}

const options: { value: ThemePref; label: string; icon: Icon }[] = [
  { value: "light", label: "Light", icon: SunIcon },
  { value: "dark", label: "Dark", icon: MoonIcon },
  { value: "system", label: "System", icon: DesktopIcon },
];

/** Light, dark, or follow the device. Native radios, so arrow keys move the choice. */
export function ThemeSwitch({ className }: { className?: string }) {
  const pref = useThemePref();
  const name = useId();
  return (
    <fieldset className={cn("inline-flex rounded-full border border-line p-1", className)}>
      <legend className="sr-only">Colour theme</legend>
      {options.map(({ value, label, icon: OptionIcon }) => (
        <label
          key={value}
          className="flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-muted transition-colors hover:text-ink has-checked:bg-surface-2 has-checked:font-medium has-checked:text-ink has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent"
        >
          <input
            type="radio"
            name={name}
            value={value}
            checked={pref === value}
            onChange={(e) => switchTheme(value, e.currentTarget.closest("label") ?? e.currentTarget)}
            className="sr-only"
          />
          <OptionIcon size={16} aria-hidden />
          {label}
        </label>
      ))}
    </fieldset>
  );
}
