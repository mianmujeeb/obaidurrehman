import {
  CrosshairIcon,
  DropIcon,
  LightningIcon,
  MicroscopeIcon,
  ScissorsIcon,
  WaveformIcon,
} from "@phosphor-icons/react/ssr";
import type { Icon } from "@phosphor-icons/react";
import type { SceneKind } from "@/lib/treatments";

const ICONS: Record<SceneKind, Icon> = {
  laser: LightningIcon,
  pcnl: CrosshairIcon,
  eswl: WaveformIcon,
  turp: DropIcon,
  lap: ScissorsIcon,
  varicocele: MicroscopeIcon,
};

export function TreatmentIcon({ kind, size = 24 }: { kind: SceneKind; size?: number }) {
  const Glyph = ICONS[kind];
  return <Glyph size={size} weight="duotone" aria-hidden />;
}
