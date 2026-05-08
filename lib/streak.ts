// Daily review streak — counts consecutive days (in Asia/Ho_Chi_Minh time)
// where the user reviewed at least one card. Today not yet reviewed still
// keeps the streak alive until the day ends, so we don't punish learners
// who plan to review later in the evening.

const VN_OFFSET_MS = 7 * 60 * 60 * 1000; // UTC+7

export function vnDateKey(input: string | Date): string {
  const d = typeof input === "string" ? new Date(input) : input;
  return new Date(d.getTime() + VN_OFFSET_MS).toISOString().slice(0, 10);
}

function todayVnKey(now: Date = new Date()): string {
  return vnDateKey(now);
}

function shiftDateKey(key: string, days: number): string {
  const [y, m, d] = key.split("-").map(Number);
  // Construct in UTC then shift — avoids local-tz drift on the host.
  const t = Date.UTC(y, m - 1, d) + days * 24 * 60 * 60 * 1000;
  return new Date(t).toISOString().slice(0, 10);
}

export function computeStreak(reviewedAtIsos: string[], now: Date = new Date()): number {
  if (reviewedAtIsos.length === 0) return 0;

  const days = new Set<string>();
  for (const iso of reviewedAtIsos) days.add(vnDateKey(iso));

  const today = todayVnKey(now);
  // If user already reviewed today, count from today; otherwise allow yesterday
  // so the streak persists through "today not done yet."
  let cursor = days.has(today) ? today : shiftDateKey(today, -1);
  if (!days.has(cursor)) return 0;

  let streak = 0;
  while (days.has(cursor)) {
    streak++;
    cursor = shiftDateKey(cursor, -1);
  }
  return streak;
}
