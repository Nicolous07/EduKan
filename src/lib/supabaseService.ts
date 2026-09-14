import { supabase, checkSupabaseConnection } from './supabase';
import {
  Post,
  PostComment,
  LibraryItem,
  QuestionItem,
  OpportunityItem,
  UserProfile
} from '../types';
import {
  INITIAL_POSTS,
  INITIAL_LIBRARY_BOOKS,
  INITIAL_QUESTIONS,
  INITIAL_OPPORTUNITIES,
  INITIAL_USER
} from '../data/mockData';

const CACHE_KEYS = {
  POSTS: 'edukan_posts_cache_v2',
  BOOKS: 'edukan_books_cache_v2',
  QUESTIONS: 'edukan_questions_cache_v2',
  SCHOLARSHIPS: 'edukan_scholarships_cache_v2',
  USER: 'edukan_user_profile_cache_v2',
  DB_STATUS: 'edukan_db_status_v2'
};

export interface DbStatus {
  online: boolean;
  tableReady: boolean;
  message: string;
  lastChecked: string;
}

let cachedDbStatus: DbStatus = {
  online: typeof navigator !== 'undefined' ? navigator.onLine : true,
  tableReady: false,
  message: 'Inaangalia mawasiliano ya Supabase...',
  lastChecked: new Date().toISOString()
};

/**
 * Check if the browser can talk to Supabase database
 */
export async function getDbStatus(): Promise<DbStatus> {
  const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
  if (!isOnline) {
    cachedDbStatus = {
      online: false,
      tableReady: false,
      message: 'Mtandao haupo (Hali ya Offline / Cache inatumika)',
      lastChecked: new Date().toISOString()
    };
    return cachedDbStatus;
  }

  try {
    const isConn = await checkSupabaseConnection();
    cachedDbStatus = {
      online: true,
      tableReady: isConn,
      message: isConn
        ? 'Imeunganishwa moja kwa moja na Supabase Database'
        : 'Supabase inapatikana (Meza bado zinasanidiwa au ziko offline cache)',
      lastChecked: new Date().toISOString()
    };
  } catch (err: any) {
    cachedDbStatus = {
      online: false,
      tableReady: false,
      message: `Hitilafu ya Supabase: ${err?.message || 'Haikuweza kuunganishwa'}`,
      lastChecked: new Date().toISOString()
    };
  }
  return cachedDbStatus;
}

// -------------------------------------------------------------
// POSTS SERVICE
// -------------------------------------------------------------

export async function fetchPostsFromDb(): Promise<{ posts: Post[]; source: 'supabase' | 'cache' }> {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && Array.isArray(data) && data.length > 0) {
      // Map DB snake_case columns to TypeScript Post model
      const mappedPosts: Post[] = data.map((row: any) => ({
        id: row.id,
        author: {
          id: row.author_id,
          name: row.author_name,
          handle: row.author_handle,
          avatar: row.author_avatar,
          school: row.author_school,
          role: row.author_role,
          verified: row.author_verified
        },
        type: row.type,
        category: row.category,
        content: row.content,
        subject: row.subject,
        mediaUrl: row.media_url,
        mediaType: row.media_type,
        pollOptions: row.poll_options,
        likes: row.likes || 0,
        commentsCount: row.comments_count || 0,
        sharesCount: row.shares_count || 0,
        isPinned: row.is_pinned,
        isFlagged: row.is_flagged,
        schoolId: row.school_id,
        schoolName: row.school_name,
        createdAt: row.created_at
      }));

      // Update offline fallback cache
      try {
        localStorage.setItem(CACHE_KEYS.POSTS, JSON.stringify(mappedPosts));
      } catch (e) {
        console.warn('Could not write posts cache', e);
      }

      return { posts: mappedPosts, source: 'supabase' };
    }
  } catch (err) {
    console.warn('Supabase fetchPosts note:', err);
  }

  // Fallback to cache or initial posts
  try {
    const cached = localStorage.getItem(CACHE_KEYS.POSTS);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return { posts: parsed, source: 'cache' };
      }
    }
  } catch (e) {
    console.warn('Posts cache read failed', e);
  }

  return { posts: INITIAL_POSTS, source: 'cache' };
}

export async function createPostInDb(post: Post): Promise<{ success: boolean; post: Post }> {
  // Update local cache first for instant feedback
  try {
    const cached = localStorage.getItem(CACHE_KEYS.POSTS);
    const list: Post[] = cached ? JSON.parse(cached) : INITIAL_POSTS;
    localStorage.setItem(CACHE_KEYS.POSTS, JSON.stringify([post, ...list]));
  } catch (e) {
    console.warn('Cache write failed:', e);
  }

  // Attempt write to Supabase
  try {
    const dbPayload = {
      id: post.id,
      author_id: post.author.id,
      author_name: post.author.name,
      author_handle: post.author.handle,
      author_avatar: post.author.avatar,
      author_school: post.author.school,
      author_role: post.author.role,
      author_verified: !!post.author.verified,
      type: post.type,
      category: post.category || 'masomo',
      content: post.content,
      subject: post.subject || null,
      media_url: post.mediaUrl || null,
      media_type: post.mediaType || null,
      poll_options: post.pollOptions || [],
      likes: post.likes || 0,
      comments_count: post.commentsCount || 0,
      shares_count: post.sharesCount || 0,
      is_pinned: !!post.isPinned,
      is_flagged: !!post.isFlagged,
      school_id: post.schoolId || null,
      school_name: post.schoolName || null,
      created_at: post.createdAt || new Date().toISOString()
    };

    const { error } = await supabase.from('posts').insert([dbPayload]);
    if (error) {
      console.warn('Supabase insert post notice (saved to offline cache):', error.message);
      return { success: false, post };
    }
    return { success: true, post };
  } catch (err) {
    console.warn('Supabase createPost exception:', err);
    return { success: false, post };
  }
}

export async function togglePostLikeInDb(postId: string, newLikes: number): Promise<void> {
  try {
    await supabase.from('posts').update({ likes: newLikes }).eq('id', postId);
  } catch (err) {
    console.warn('Like update failed on Supabase:', err);
  }
}

// -------------------------------------------------------------
// BOOKS / LIBRARY SERVICE
// -------------------------------------------------------------

export async function fetchBooksFromDb(): Promise<{ books: LibraryItem[]; source: 'supabase' | 'cache' }> {
  try {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && Array.isArray(data) && data.length > 0) {
      const mappedBooks: LibraryItem[] = data.map((row: any) => ({
        id: row.id,
        title: row.title,
        category: row.category,
        level: row.level,
        classGrade: row.class_grade,
        subject: row.subject,
        year: row.year,
        authorOrPublisher: row.author_or_publisher,
        fileFormat: row.file_format,
        fileSize: row.file_size,
        coverImage: row.cover_image,
        downloadsCount: row.downloads_count || 0,
        description: row.description,
        uploaderName: row.uploader_name,
        uploaderRole: row.uploader_role,
        uploaderSchool: row.uploader_school,
        verified: row.verified,
        pages: row.pages,
        downloadUrl: row.download_url,
        createdAt: row.created_at
      }));

      try {
        localStorage.setItem(CACHE_KEYS.BOOKS, JSON.stringify(mappedBooks));
      } catch (e) {
        console.warn('Could not write books cache', e);
      }

      return { books: mappedBooks, source: 'supabase' };
    }
  } catch (err) {
    console.warn('Supabase fetchBooks notice:', err);
  }

  // Fallback to cache or initial books
  try {
    const cached = localStorage.getItem(CACHE_KEYS.BOOKS);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return { books: parsed, source: 'cache' };
      }
    }
  } catch (e) {
    console.warn('Books cache read failed', e);
  }

  return { books: INITIAL_LIBRARY_BOOKS, source: 'cache' };
}

export async function createBookInDb(book: LibraryItem): Promise<{ success: boolean; book: LibraryItem }> {
  try {
    const cached = localStorage.getItem(CACHE_KEYS.BOOKS);
    const list: LibraryItem[] = cached ? JSON.parse(cached) : INITIAL_LIBRARY_BOOKS;
    localStorage.setItem(CACHE_KEYS.BOOKS, JSON.stringify([book, ...list]));
  } catch (e) {
    console.warn('Books cache write failed', e);
  }

  try {
    const dbPayload = {
      id: book.id,
      title: book.title,
      category: book.category,
      level: book.level,
      class_grade: book.classGrade,
      subject: book.subject,
      year: book.year ? String(book.year) : null,
      author_or_publisher: book.authorOrPublisher,
      file_format: book.fileFormat,
      file_size: book.fileSize,
      cover_image: book.coverImage || null,
      downloads_count: book.downloadsCount || 0,
      description: book.description || null,
      uploader_name: book.uploaderName,
      uploader_role: book.uploaderRole,
      uploader_school: book.uploaderSchool || null,
      verified: !!book.verified,
      pages: book.pages || 100,
      download_url: book.downloadUrl || null,
      created_at: book.createdAt || new Date().toISOString()
    };

    const { error } = await supabase.from('books').insert([dbPayload]);
    if (error) {
      console.warn('Supabase book insert notice:', error.message);
      return { success: false, book };
    }
    return { success: true, book };
  } catch (err) {
    console.warn('Supabase createBook exception:', err);
    return { success: false, book };
  }
}

// -------------------------------------------------------------
// STUDY ROOMS / QUESTIONS SERVICE
// -------------------------------------------------------------

export async function fetchStudyQuestionsFromDb(): Promise<{ questions: QuestionItem[]; source: 'supabase' | 'cache' }> {
  try {
    const { data, error } = await supabase
      .from('study_rooms')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && Array.isArray(data) && data.length > 0) {
      const mapped: QuestionItem[] = data.map((row: any) => ({
        id: row.id,
        author: {
          id: row.author_id,
          name: row.author_name,
          avatar: row.author_avatar,
          school: row.author_school,
          form: row.author_form
        },
        subject: row.subject,
        topic: row.topic,
        title: row.title,
        content: row.content,
        imageUrl: row.image_url,
        viewsCount: row.views_count || 0,
        hasBestAnswer: row.has_best_answer || false,
        answers: row.answers || [],
        createdAt: row.created_at
      }));

      try {
        localStorage.setItem(CACHE_KEYS.QUESTIONS, JSON.stringify(mapped));
      } catch (e) {
        console.warn('Could not write questions cache', e);
      }

      return { questions: mapped, source: 'supabase' };
    }
  } catch (err) {
    console.warn('Supabase fetchQuestions notice:', err);
  }

  try {
    const cached = localStorage.getItem(CACHE_KEYS.QUESTIONS);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return { questions: parsed, source: 'cache' };
      }
    }
  } catch (e) {
    console.warn('Questions cache read failed', e);
  }

  return { questions: INITIAL_QUESTIONS, source: 'cache' };
}

export async function createQuestionInDb(question: QuestionItem): Promise<{ success: boolean; question: QuestionItem }> {
  try {
    const cached = localStorage.getItem(CACHE_KEYS.QUESTIONS);
    const list: QuestionItem[] = cached ? JSON.parse(cached) : INITIAL_QUESTIONS;
    localStorage.setItem(CACHE_KEYS.QUESTIONS, JSON.stringify([question, ...list]));
  } catch (e) {
    console.warn('Questions cache write failed', e);
  }

  try {
    const payload = {
      id: question.id,
      author_id: question.author.id || null,
      author_name: question.author.name,
      author_avatar: question.author.avatar,
      author_school: question.author.school,
      author_form: question.author.form,
      subject: question.subject,
      topic: question.topic,
      title: question.title,
      content: question.content,
      image_url: question.imageUrl || null,
      views_count: question.viewsCount || 0,
      has_best_answer: question.hasBestAnswer || false,
      answers: question.answers || [],
      created_at: question.createdAt || new Date().toISOString()
    };

    const { error } = await supabase.from('study_rooms').insert([payload]);
    if (error) {
      console.warn('Supabase question insert notice:', error.message);
      return { success: false, question };
    }
    return { success: true, question };
  } catch (err) {
    console.warn('Supabase createQuestion exception:', err);
    return { success: false, question };
  }
}

// -------------------------------------------------------------
// SCHOLARSHIPS SERVICE
// -------------------------------------------------------------

export async function fetchScholarshipsFromDb(): Promise<{ scholarships: OpportunityItem[]; source: 'supabase' | 'cache' }> {
  try {
    const { data, error } = await supabase
      .from('scholarships')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && Array.isArray(data) && data.length > 0) {
      const mapped: OpportunityItem[] = data.map((row: any) => ({
        id: row.id,
        title: row.name,
        category: 'Scholarship',
        organizer: row.provider,
        deadline: row.deadline,
        eligibility: `${row.target_level} | Min Division: ${row.min_division || 'N/A'} (GPA ${row.min_gpa || '3.5+'})`,
        location: 'Tanzania / Vyuo Vikuu vya Umma',
        rewardOrStipend: row.coverage,
        description: row.description || `Ufadhili wa ${row.name} unaotolewa na ${row.provider}. Lengo kuu ni ${row.focus_area}.`,
        link: row.link || 'https://www.moe.go.tz',
        applicationsCount: row.applications_count || 0,
        tags: [row.focus_area, row.target_level, 'Ufadhili Rasmi']
      }));

      try {
        localStorage.setItem(CACHE_KEYS.SCHOLARSHIPS, JSON.stringify(mapped));
      } catch (e) {
        console.warn('Could not write scholarships cache', e);
      }

      return { scholarships: mapped, source: 'supabase' };
    }
  } catch (err) {
    console.warn('Supabase scholarships fetch notice:', err);
  }

  try {
    const cached = localStorage.getItem(CACHE_KEYS.SCHOLARSHIPS);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return { scholarships: parsed, source: 'cache' };
      }
    }
  } catch (e) {
    console.warn('Scholarships cache read failed', e);
  }

  return { scholarships: INITIAL_OPPORTUNITIES, source: 'cache' };
}

// -------------------------------------------------------------
// USER PROFILE SERVICE
// -------------------------------------------------------------

export async function saveUserProfileToDb(profile: UserProfile): Promise<{ success: boolean; profile: UserProfile }> {
  try {
    localStorage.setItem(CACHE_KEYS.USER, JSON.stringify(profile));
  } catch (e) {
    console.warn('Could not write user profile cache', e);
  }

  try {
    const payload = {
      id: profile.id,
      name: profile.name,
      handle: profile.handle,
      email: profile.email,
      role: profile.role,
      avatar: profile.avatar,
      cover_photo: profile.coverPhoto || null,
      school_id: profile.schoolId || null,
      school_name: profile.schoolName,
      school_region: profile.schoolRegion || 'Simiyu',
      school_district: profile.schoolDistrict || 'Maswa',
      level: profile.level,
      combination: profile.combination || null,
      title: profile.title || null,
      bio: profile.bio || '',
      points: profile.points || 150,
      followers_count: profile.followersCount || 0,
      following_count: profile.followingCount || 0,
      student_reg_no: profile.studentRegNo || null,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase.from('users_profiles').upsert(payload);
    if (error) {
      console.warn('Supabase profile upsert notice:', error.message);
      return { success: false, profile };
    }
    return { success: true, profile };
  } catch (err) {
    console.warn('Supabase saveUserProfile exception:', err);
    return { success: false, profile };
  }
}
