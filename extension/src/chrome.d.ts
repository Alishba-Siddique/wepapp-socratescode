declare const chrome: {
  sidePanel: { setPanelBehavior(options: { openPanelOnActionClick: boolean }): Promise<void> };
  tabs: { query(options: { active: boolean; currentWindow: boolean }): Promise<{ id?: number; url?: string; title?: string }[]> };
  storage: { local: { get(key: string): Promise<Record<string, unknown>>; set(items: Record<string, unknown>): Promise<void>; remove(key: string): Promise<void> } };
};
