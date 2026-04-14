export const SUBJECT_KEYS = [
  "math",
  "english",
  "hebrew",
  "arabic",
  "physics",
  "chemistry",
  "biology",
  "history",
  "geography",
  "bible",
  "literature",
  "civics",
  "computer_science",
  "other",
] as const;

export type SubjectKey = (typeof SUBJECT_KEYS)[number];

// Translate a subject value for display.
// If it's a known key, returns the translated label.
// Otherwise returns the value as-is (for backwards compatibility with old free-text entries).
export function translateSubject(value: string, t: (key: string) => string): string {
  if (!value) return "";
  if ((SUBJECT_KEYS as readonly string[]).includes(value)) {
    return t(`subject.${value}`);
  }
  return value;
}
