import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { NavTabItem, DEFAULT_NAV_TABS } from '@/data/navigationConfig';

export interface ChatMessage {
  id: string;
  role: 'user' | 'tutor' | 'system';
  content: string;
}

export type LogoStyle = 'pure' | 'vibrant' | 'glass' | 'cobalt';

export interface UserProgress {
  solvedQuestionIds: string[];
  reviewQuestionIds: string[];
  streakDays: number;
  hasPracticedToday: boolean;
}

interface AppState {
  currentQuestionId: string | null;
  chatHistory: ChatMessage[];
  currentSocraticStep: number;
  role: 'aluno' | 'professor';
  tokenUsage: number;
  logoStyle: LogoStyle;
  activeMatricula: string | null;
  userProgressMap: Record<string, UserProgress>;
  solvedQuestionIds: string[];
  reviewQuestionIds: string[];
  streakDays: number;
  hasPracticedToday: boolean;
  navigationTabs: NavTabItem[];
  
  // Actions
  setNavigationTabs: (tabs: NavTabItem[]) => void;
  setCurrentQuestionId: (id: string | null) => void;
  addChatMessage: (msg: Omit<ChatMessage, 'id'>) => void;
  updateLastMessage: (content: string) => void;
  resetChat: () => void;
  advanceSocraticStep: () => void;
  setRole: (role: 'aluno' | 'professor') => void;
  addTokenUsage: (amount: number) => void;
  setLogoStyle: (style: LogoStyle) => void;
  setActiveUser: (matricula: string | null) => void;
  resetUserProgress: () => void;
  markQuestionResult: (questionId: string, isCorrect: boolean) => void;
  syncQuestionProgress: (
    solvedIds: string[],
    reviewIds: string[],
    matricula?: string,
    streak?: { currentStreak: number; hasPracticedToday: boolean }
  ) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      currentQuestionId: null,
      chatHistory: [],
      currentSocraticStep: 0,
      role: 'professor',
      tokenUsage: 0,
      logoStyle: 'pure',
      activeMatricula: null,
      userProgressMap: {},
      solvedQuestionIds: [],
      reviewQuestionIds: [],
      streakDays: 0,
      hasPracticedToday: false,
      navigationTabs: DEFAULT_NAV_TABS,
      
      setNavigationTabs: (tabs) => set({ navigationTabs: tabs }),
      setCurrentQuestionId: (id) => set({ currentQuestionId: id, chatHistory: [], currentSocraticStep: 0 }),
      addChatMessage: (msg) => set((state) => ({ 
        chatHistory: [...state.chatHistory, { ...msg, id: Math.random().toString(36).substring(7) }] 
      })),
      updateLastMessage: (content) => set((state) => {
        const newHistory = [...state.chatHistory];
        if (newHistory.length > 0) {
          newHistory[newHistory.length - 1] = {
            ...newHistory[newHistory.length - 1],
            content: content
          };
        }
        return { chatHistory: newHistory };
      }),
      resetChat: () => set({ chatHistory: [], currentSocraticStep: 0 }),
      advanceSocraticStep: () => set((state) => ({ currentSocraticStep: Math.min(state.currentSocraticStep + 1, 4) })),
      setRole: (role) => set({ role }),
      addTokenUsage: (amount) => set((state) => ({ tokenUsage: state.tokenUsage + amount })),
      setLogoStyle: (style) => set({ logoStyle: style }),

      // Define o usuário ativo e isola seu histórico de questões resolvidas e ofensiva
      setActiveUser: (matricula) => set((state) => {
        const key = matricula || 'guest';
        const userProgress = state.userProgressMap[key] || {
          solvedQuestionIds: [],
          reviewQuestionIds: [],
          streakDays: 0,
          hasPracticedToday: false,
        };
        return {
          activeMatricula: matricula,
          solvedQuestionIds: userProgress.solvedQuestionIds || [],
          reviewQuestionIds: userProgress.reviewQuestionIds || [],
          streakDays: userProgress.streakDays || 0,
          hasPracticedToday: Boolean(userProgress.hasPracticedToday),
        };
      }),

      // Limpa dados de sessão atual em logout
      resetUserProgress: () => set(() => ({
        activeMatricula: null,
        solvedQuestionIds: [],
        reviewQuestionIds: [],
        streakDays: 0,
        hasPracticedToday: false,
        chatHistory: [],
        currentQuestionId: null,
        currentSocraticStep: 0,
      })),

      markQuestionResult: (questionId, isCorrect) => set((state) => {
        const userKey = state.activeMatricula || 'guest';
        let nextSolved = state.solvedQuestionIds;
        let nextReview = state.reviewQuestionIds;

        if (isCorrect) {
          nextSolved = Array.from(new Set([...state.solvedQuestionIds, questionId]));
          nextReview = state.reviewQuestionIds.filter((id) => id !== questionId);
        } else {
          if (!state.solvedQuestionIds.includes(questionId)) {
            nextReview = Array.from(new Set([...state.reviewQuestionIds, questionId]));
          }
        }

        // Se praticou, a ofensiva de hoje é validada
        const nextHasPracticed = true;
        const nextStreakDays = state.hasPracticedToday
          ? state.streakDays
          : Math.max(1, state.streakDays + 1);

        const nextMap = {
          ...state.userProgressMap,
          [userKey]: {
            solvedQuestionIds: nextSolved,
            reviewQuestionIds: nextReview,
            streakDays: nextStreakDays,
            hasPracticedToday: nextHasPracticed,
          },
        };

        return {
          solvedQuestionIds: nextSolved,
          reviewQuestionIds: nextReview,
          streakDays: nextStreakDays,
          hasPracticedToday: nextHasPracticed,
          userProgressMap: nextMap,
        };
      }),

      syncQuestionProgress: (solvedIds, reviewIds, matricula, streak) => set((state) => {
        const targetMatricula = matricula !== undefined ? matricula : state.activeMatricula;
        const userKey = targetMatricula || 'guest';

        const prevUser = state.userProgressMap[userKey] || { streakDays: 0, hasPracticedToday: false };
        const nextStreakDays = streak?.currentStreak !== undefined ? streak.currentStreak : prevUser.streakDays || 0;
        const nextHasPracticed = streak?.hasPracticedToday !== undefined ? streak.hasPracticedToday : prevUser.hasPracticedToday || false;

        const nextMap = {
          ...state.userProgressMap,
          [userKey]: {
            solvedQuestionIds: solvedIds,
            reviewQuestionIds: reviewIds,
            streakDays: nextStreakDays,
            hasPracticedToday: nextHasPracticed,
          },
        };

        // Atualiza a visualização se for para o usuário atualmente ativo
        if (!targetMatricula || targetMatricula === state.activeMatricula) {
          return {
            solvedQuestionIds: solvedIds,
            reviewQuestionIds: reviewIds,
            streakDays: nextStreakDays,
            hasPracticedToday: nextHasPracticed,
            userProgressMap: nextMap,
          };
        }

        return { userProgressMap: nextMap };
      }),
    }),
    {
      name: 'mathai-storage',
      partialize: (state) => ({
        tokenUsage: state.tokenUsage,
        logoStyle: state.logoStyle,
        activeMatricula: state.activeMatricula,
        userProgressMap: state.userProgressMap,
        solvedQuestionIds: state.solvedQuestionIds,
        reviewQuestionIds: state.reviewQuestionIds,
        streakDays: state.streakDays,
        hasPracticedToday: state.hasPracticedToday,
        navigationTabs: state.navigationTabs,
      }),
    }
  )
);
