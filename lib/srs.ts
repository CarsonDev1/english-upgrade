// SM-2 Spaced Repetition algorithm (Anki-style).
// Rating: 1=Again, 2=Hard, 3=Good, 4=Easy.

export interface SRSCard {
  ease_factor: number;
  interval_days: number;
  repetitions: number;
}

export interface SRSResult {
  ease_factor: number;
  interval_days: number;
  repetitions: number;
  next_review_at: Date;
  last_reviewed_at: Date;
}

export function applySRS(card: SRSCard, rating: 1 | 2 | 3 | 4): SRSResult {
  let { ease_factor, interval_days, repetitions } = card;
  const now = new Date();

  if (rating === 1) {
    // Lapse — reset
    repetitions = 0;
    interval_days = 0;
    ease_factor = Math.max(1.3, ease_factor - 0.2);
  } else {
    repetitions += 1;
    if (repetitions === 1) {
      interval_days = rating === 4 ? 4 : 1;
    } else if (repetitions === 2) {
      interval_days = rating === 4 ? 7 : 3;
    } else {
      const factor =
        rating === 2 ? 1.2 :
        rating === 3 ? ease_factor :
        ease_factor * 1.3;
      interval_days = Math.max(1, Math.round(interval_days * factor));
    }

    // Adjust ease factor (SM-2 formula, simplified for 4 ratings)
    const q = rating === 2 ? 3 : rating === 3 ? 4 : 5;
    ease_factor = Math.max(
      1.3,
      ease_factor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)),
    );
  }

  const next = new Date(now);
  // For "Again" we want to retry within 10 minutes
  if (rating === 1) {
    next.setMinutes(next.getMinutes() + 10);
  } else {
    next.setDate(next.getDate() + interval_days);
  }

  return {
    ease_factor: Math.round(ease_factor * 1000) / 1000,
    interval_days,
    repetitions,
    next_review_at: next,
    last_reviewed_at: now,
  };
}

export function intervalLabel(days: number): string {
  if (days < 1) return "<1d";
  if (days < 30) return `${days}d`;
  if (days < 365) return `${Math.round(days / 30)}mo`;
  return `${(days / 365).toFixed(1)}y`;
}
