export interface EduPointsTier {
  level: number;
  name: string;
  min: number;
  max: number;
  title: string;
  badge: string;
  color: string;
}

export const EDUPOINTS_TIERS: EduPointsTier[] = [
  { level: 1, name: 'Mwanafunzi Mgeni', min: 0, max: 250, title: 'Kiwango cha 1', badge: '🌱', color: 'text-emerald-700 bg-emerald-100' },
  { level: 2, name: 'Mtafiti Chipukizi', min: 251, max: 600, title: 'Kiwango cha 2', badge: '📚', color: 'text-blue-700 bg-blue-100' },
  { level: 3, name: 'Mwanazuoni Shupavu', min: 601, max: 1200, title: 'Kiwango cha 3', badge: '💡', color: 'text-indigo-700 bg-indigo-100' },
  { level: 4, name: 'Bingwa wa EduKan', min: 1201, max: 2000, title: 'Kiwango cha 4', badge: '🎖️', color: 'text-amber-800 bg-amber-100' },
  { level: 5, name: 'Nahodha wa Elimu', min: 2001, max: 5000, title: 'Kiwango cha 5', badge: '👑', color: 'text-purple-800 bg-purple-100' }
];

export function getEduPointsInfo(points: number) {
  const currentTier = EDUPOINTS_TIERS.find(t => points >= t.min && points <= t.max) || EDUPOINTS_TIERS[EDUPOINTS_TIERS.length - 1];
  const nextTier = EDUPOINTS_TIERS.find(t => t.level === currentTier.level + 1);

  const range = currentTier.max - currentTier.min;
  const earnedInRange = Math.max(0, points - currentTier.min);
  const progressPercent = Math.min(100, Math.round((earnedInRange / range) * 100));
  const pointsToNext = nextTier ? Math.max(0, nextTier.min - points) : 0;

  return {
    tier: currentTier,
    nextTier,
    progressPercent,
    pointsToNext,
    totalPoints: points
  };
}
