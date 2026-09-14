import { useState, useEffect } from 'react';
import {
  UserProfile,
  Post,
  SchoolCommunity,
  OpportunityItem,
  QuestionItem,
  StudyResource,
  AppNotification,
  UserRole
} from '../types';
import {
  INITIAL_USER,
  INITIAL_SCHOOLS,
  INITIAL_POSTS,
  INITIAL_QUESTIONS,
  INITIAL_RESOURCES,
  INITIAL_OPPORTUNITIES,
  INITIAL_NOTIFICATIONS
} from '../data/mockData';

const STORAGE_KEYS = {
  USER: 'edukan_current_user',
  POSTS: 'edukan_posts',
  SCHOOLS: 'edukan_schools',
  QUESTIONS: 'edukan_questions',
  RESOURCES: 'edukan_resources',
  OPPORTUNITIES: 'edukan_opportunities',
  NOTIFICATIONS: 'edukan_notifications',
  ROLE: 'edukan_active_role'
};

export function getInitialState<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

export function saveState<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn('Storage save failed:', err);
  }
}
