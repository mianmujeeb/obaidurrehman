"use client";

import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { PhoneIcon } from "@phosphor-icons/react";
import { phones } from "@/lib/doctor";
import { BookButton } from "./booking";

/** Thumb-reach actions on phones, shown once the hero buttons scroll away. */
export function MobileActionBar() {
  const { scrollY } = useScroll();
  const [show, setShow] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setShow(y > window.innerHeight * 0.7));

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: "110%" }}
          animate={{ y: 0 }}
          exit={{ y: "110%" }}
          transition={{ type: "spring", stiffness: 260, damping: 30 }}
          className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-bg/95 px-4 backdrop-blur-xl pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3 md:hidden"
        >
          <div className="flex gap-3">
            <a
              href={`tel:${phones.oladoc.tel}`}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-line bg-surface px-5 py-3 text-sm font-semibold active:scale-[0.98]"
            >
              <PhoneIcon size={18} weight="bold" aria-hidden />
              Call
            </a>
            <BookButton className="flex-1" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
