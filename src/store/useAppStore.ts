import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ChatMessage {
  id: string;
  role: 'user' | 'tutor' | 'system';
  content: string;
}

export type LogoStyle = 'pure' | 'vibrant' | 'glass' | 'cobalt';

interface AppState {
  currentQuestionId: string | null;
  chatHistory: ChatMessage[];
  currentSocraticStep: number;
  role: 'aluno' | 'professor';
  tokenUsage: number;
  logoStyle: LogoStyle;
  
  // Actions
  setCurrentQuestionId: (id: string | null) => void;
  addChatMessage: (msg: Omit<ChatMessage, 'id'>) => void;
  updateLastMessage: (content: string) => void;
  resetChat: () => void;
  advanceSocraticStep: () => void;
  setRole: (role: 'aluno' | 'professor') => void;
  addTokenUsage: (amount: number) => void;
  setLogoStyle: (style: LogoStyle) => void;
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
    }),
    {
      name: 'mathai-storage',
      partialize: (state) => ({ tokenUsage: state.tokenUsage, logoStyle: state.logoStyle }), // Save tokenUsage and logoStyle
    }
  )
);
