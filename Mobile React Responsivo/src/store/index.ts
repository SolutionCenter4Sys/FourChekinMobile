import { create } from 'zustand'
import type { Usuario, Audiencia, Checkin, Notificacao, GeoResult } from '@/types'

interface AppState {
  // Auth
  usuario: Usuario | null
  token: string | null
  onboardingConcluido: boolean

  // Dados
  audiencias: Audiencia[]
  checkins: Checkin[]
  notificacoes: Notificacao[]

  // UI
  loading: boolean
  error: string | null

  // Geolocalização (CheckIn)
  geoResult: GeoResult | null

  // Offline
  isOnline: boolean
  checkinsOffline: object[]

  // Actions
  setUsuario: (u: Usuario | null) => void
  setToken: (t: string | null) => void
  setOnboardingConcluido: (v: boolean) => void
  setAudiencias: (a: Audiencia[]) => void
  setCheckins: (c: Checkin[]) => void
  setNotificacoes: (n: Notificacao[]) => void
  setLoading: (v: boolean) => void
  setError: (e: string | null) => void
  setGeoResult: (g: GeoResult | null) => void
  setIsOnline: (v: boolean) => void
  addCheckinOffline: (c: object) => void
  marcarNotificacaoLida: (id: string) => void
  logout: () => void
}

export const useStore = create<AppState>((set) => ({
  usuario: null,
  token: null,
  onboardingConcluido: localStorage.getItem('onboarding_ok') === '1',
  audiencias: [],
  checkins: [],
  notificacoes: [],
  loading: false,
  error: null,
  geoResult: null,
  isOnline: navigator.onLine,
  checkinsOffline: [],

  setUsuario: (u) => set({ usuario: u }),
  setToken: (t) => {
    if (t) sessionStorage.setItem('auth_token', t)
    else sessionStorage.removeItem('auth_token')
    set({ token: t })
  },
  setOnboardingConcluido: (v) => {
    localStorage.setItem('onboarding_ok', v ? '1' : '0')
    set({ onboardingConcluido: v })
  },
  setAudiencias: (a) => set({ audiencias: a }),
  setCheckins: (c) => set({ checkins: c }),
  setNotificacoes: (n) => set({ notificacoes: n }),
  setLoading: (v) => set({ loading: v }),
  setError: (e) => set({ error: e }),
  setGeoResult: (g) => set({ geoResult: g }),
  setIsOnline: (v) => set({ isOnline: v }),
  addCheckinOffline: (c) => set((s) => ({ checkinsOffline: [...s.checkinsOffline, c] })),
  marcarNotificacaoLida: (id) =>
    set((s) => ({
      notificacoes: s.notificacoes.map((n) => (n.id === id ? { ...n, lida: true } : n)),
    })),
  logout: () => {
    sessionStorage.removeItem('auth_token')
    set({ usuario: null, token: null, audiencias: [], checkins: [], notificacoes: [] })
  },
}))
