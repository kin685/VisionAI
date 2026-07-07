export const PERSONA_META = {
  academic: {
    label: "Academic",
    icon: "school-outline" as const,
    color: "#4FD1C5",
  },
  safety: {
    label: "Safety",
    icon: "shield-checkmark-outline" as const,
    color: "#FF6B4A",
  },
  inventory: {
    label: "Inventory",
    icon: "file-tray-stacked-outline" as const,
    color: "#F5C542",
  },
};

export type PersonaKey = keyof typeof PERSONA_META;
