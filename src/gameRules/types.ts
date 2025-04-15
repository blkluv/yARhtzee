import { getScore } from "./getScore";

export const categories = [
  "Aces",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",

  "Three Of A Kind",
  "Four Of A Kind",
  "Full House",
  "Small Straight",
  "Large Straight",
  "Yahtzee",
  "Chance",
] as const;

export type Category = (typeof categories)[number];

export type DiceValue = 1 | 2 | 3 | 4 | 5 | 6;

export type ScoreSheet = Record<Category, DiceValue[] | null>;
export type FinishedScoreSheet = Record<Category, DiceValue[]>;

export const isScoreSheet = (s: any, nDice: number): s is ScoreSheet =>
  s &&
  categories.every(
    (c) =>
      !s[c] ||
      (Array.isArray(s[c]) && s[c].length === nDice && s[c].every(isDiceValue))
  );

export const isDiceValue = (d: any): d is DiceValue =>
  d === 1 || d === 2 || d === 3 || d === 4 || d === 5 || d === 6;

export const createEmptyScoreSheet = () =>
  Object.fromEntries(
    categories.map((category) => [category, null])
  ) as ScoreSheet;

export const isScoreSheetFinished = (
  scoreSheet: ScoreSheet
): scoreSheet is FinishedScoreSheet => categories.every((c) => scoreSheet[c]);

export const isScoreSheetEmpty = (scoreSheet: ScoreSheet) =>
  !categories.some((c) => scoreSheet[c]);

export const getScoreSheetScore = (scoreSheet: ScoreSheet) =>
  categories.reduce(
    (sum, c) => sum + (scoreSheet[c] ? getScore(c, scoreSheet[c]) : 0),
    0
  );
