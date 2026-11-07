import { addDays, format, isBefore } from 'date-fns';
import type { SRSData } from '../types/chess';

// SM-2 Algorithm Implementation
export const calculateSRS = (
  performanceRating: number, // 0 to 5
  previousSRS?: SRSData
): Omit<SRSData, 'id'> => {
  let {
    easinessFactor = 2.5,
    interval = 0,
    repetitions = 0,
  } = previousSRS || {};

  if (performanceRating >= 3) {
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easinessFactor);
    }
    repetitions += 1;
  } else {
    repetitions = 0;
    interval = 1;
  }

  easinessFactor =
    easinessFactor +
    (0.1 - (5 - performanceRating) * (0.08 + (5 - performanceRating) * 0.02));

  if (easinessFactor < 1.3) easinessFactor = 1.3;

  const nextReviewDate = format(addDays(new Date(), interval), 'yyyy-MM-dd');

  return {
    easinessFactor,
    interval,
    repetitions,
    nextReviewDate,
    lastAccuracy: performanceRating,
  };
};

const STORAGE_KEY = 'chess_srs_data';

export const saveSRSData = (variationId: string, performanceRating: number) => {
  const allData = getAllSRSData();
  const existing = allData[variationId];
  const updated = {
    id: variationId,
    ...calculateSRS(performanceRating, existing),
  };

  allData[variationId] = updated;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allData));
};

export const getAllSRSData = (): Record<string, SRSData> => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : {};
};

export const getDueVariations = (variationIds: string[]): string[] => {
  const allData = getAllSRSData();
  const now = new Date();

  return variationIds.filter(id => {
    const srs = allData[id];
    if (!srs) return true; // New items are "due"
    return isBefore(new Date(srs.nextReviewDate), now);
  });
};
