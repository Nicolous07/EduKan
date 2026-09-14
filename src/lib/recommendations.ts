import { Post, QuestionItem, LibraryItem, UserProfile } from '../types';

/**
 * Normalizes academic level strings to standard categories:
 * - 'university' (Chuo Kikuu, Higher Ed, Shahada, Diploma)
 * - 'a_level' (Kidato cha 5 - 6, Form V - VI, ACSEE, High School)
 * - 'o_level' (Kidato cha 1 - 4, Form I - IV, CSEE, Secondary)
 * - 'primary' (Msingi)
 */
export function normalizeLevel(levelStr?: string): 'university' | 'a_level' | 'o_level' | 'primary' | 'all' {
  if (!levelStr) return 'all';
  const l = levelStr.toLowerCase();

  if (
    l.includes('chuo') ||
    l.includes('university') ||
    l.includes('higher') ||
    l.includes('shahada') ||
    l.includes('diploma') ||
    l.includes('udsm') ||
    l.includes('muhas') ||
    l.includes('dit') ||
    l.includes('sua') ||
    l.includes('must') ||
    l.includes('mzumbe')
  ) {
    return 'university';
  }

  if (
    l.includes('form vi') ||
    l.includes('form v') ||
    l.includes('form 6') ||
    l.includes('form 5') ||
    l.includes('kidato cha 6') ||
    l.includes('kidato cha 5') ||
    l.includes('kidato cha v') ||
    l.includes('kidato cha vi') ||
    l.includes('a-level') ||
    l.includes('acsee') ||
    l.includes('high school')
  ) {
    return 'a_level';
  }

  if (
    l.includes('form iv') ||
    l.includes('form iii') ||
    l.includes('form ii') ||
    l.includes('form i') ||
    l.includes('form 4') ||
    l.includes('form 3') ||
    l.includes('form 2') ||
    l.includes('form 1') ||
    l.includes('kidato cha 4') ||
    l.includes('kidato cha 3') ||
    l.includes('kidato cha 2') ||
    l.includes('kidato cha 1') ||
    l.includes('kidato cha iv') ||
    l.includes('kidato cha i') ||
    l.includes('o-level') ||
    l.includes('csee')
  ) {
    return 'o_level';
  }

  if (l.includes('msingi') || l.includes('primary') || l.includes('darasa')) {
    return 'primary';
  }

  return 'all';
}

/**
 * Detects the academic target level of a post from its content, author, or school.
 */
export function detectPostTargetLevel(post: Post): 'university' | 'a_level' | 'o_level' | 'all' {
  const text = `${post.content} ${post.subject || ''} ${post.author.school || ''}`.toLowerCase();

  if (
    text.includes('chuo kikuu') ||
    text.includes('university') ||
    text.includes('undergraduate') ||
    text.includes('degree') ||
    text.includes('shahada') ||
    text.includes('data science') ||
    text.includes('python for data') ||
    text.includes('pathology') ||
    text.includes('muhas') ||
    text.includes('udsm') ||
    text.includes('mzumbe') ||
    text.includes('research paper') ||
    text.includes('internship') ||
    text.includes('scholarship')
  ) {
    return 'university';
  }

  if (
    text.includes('acsee') ||
    text.includes('form vi') ||
    text.includes('form v') ||
    text.includes('form 6') ||
    text.includes('form 5') ||
    text.includes('kidato cha sita') ||
    text.includes('kidato cha tano') ||
    text.includes('pcb') ||
    text.includes('pcm') ||
    text.includes('cbg') ||
    text.includes('hgl') ||
    text.includes('hkl') ||
    text.includes('egm') ||
    text.includes('advanced physics') ||
    text.includes('advanced chemistry') ||
    text.includes('advanced math') ||
    text.includes('a-level')
  ) {
    return 'a_level';
  }

  if (
    text.includes('csee') ||
    text.includes('form iv') ||
    text.includes('form 4') ||
    text.includes('kidato cha nne') ||
    text.includes('kidato cha tatu') ||
    text.includes('kidato cha pili') ||
    text.includes('kidato cha kwanza') ||
    text.includes('form 1') ||
    text.includes('form 2') ||
    text.includes('form 3') ||
    text.includes('basic math') ||
    text.includes('o-level')
  ) {
    return 'o_level';
  }

  return 'all';
}

/**
 * Checks if a post is appropriate for a user's level.
 * Prevents University students from seeing elementary/Form 1 questions,
 * and tailors content to their academic role.
 */
export function isPostRecommendedForUser(post: Post, user: UserProfile): boolean {
  const userCategory = normalizeLevel(user.level);
  if (userCategory === 'all') return true;

  const postCategory = detectPostTargetLevel(post);

  // General motivational or campus/national achievements are welcome for all
  if (postCategory === 'all') return true;

  // Exact match gets highest priority
  if (userCategory === postCategory) return true;

  // University students should NOT see O-level Form 1-4 school work
  if (userCategory === 'university' && postCategory === 'o_level') {
    return false;
  }

  // O-Level students shouldn't get overwhelmed by advanced university degree research papers
  if (userCategory === 'o_level' && postCategory === 'university') {
    return false;
  }

  // A-Level students can benefit from university career/mentorship advice, but shouldn't see Form 1
  if (userCategory === 'a_level' && postCategory === 'o_level') {
    return false;
  }

  return true;
}

/**
 * Checks if a study room question matches user's academic level.
 */
export function isQuestionRecommendedForUser(q: QuestionItem, user: UserProfile): boolean {
  const userCategory = normalizeLevel(user.level);
  if (userCategory === 'all') return true;

  const qCategory = normalizeLevel(`${q.author.form} ${q.title} ${q.content} ${q.topic}`);
  if (qCategory === 'all') return true;

  // Direct match
  if (userCategory === qCategory) return true;

  // High schoolers and university shouldn't see elementary O-Level questions
  if ((userCategory === 'university' || userCategory === 'a_level') && qCategory === 'o_level') {
    return false;
  }

  // O-Level students shouldn't see complex university medicine/engineering queries
  if (userCategory === 'o_level' && qCategory === 'university') {
    return false;
  }

  return true;
}
