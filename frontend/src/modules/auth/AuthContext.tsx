import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { api } from '../../services/api'

const STORAGE_KEY = 'foodmanager.auth'

export type JwtPayload = {
  sub?: string | number
  user?: string
  isAdmin?: boolean
  iat?: number
  exp?: number
}

function parseJwt(token: string): JwtPayload | null {
  try {
    const [, payloadB64] = token.split('.')
    const json = atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(json)
  } catch {
    return null
  }
}

type AuthState = { token: string | null; payload: JwtPayload | null }

type AuthContextValue = AuthState & {
  login: (user: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [payload, setPayload] = useState<JwtPayload | null>(null)

  // Bootstrap do localStorage
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const { token: t } = JSON.parse(raw)
      if (t) {
        setToken(t)
        setPayload(parseJwt(t))
      }
    }
  }, [])

  const login = async (user: string, password: string) => {
    const res = await api.post('/auth/login', { user, password, senha: password } as any)
    const t: string | undefined = res.data?.access_token || res.data?.token
    if (!t) throw new Error('Resposta sem token')

    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: t }))
    setToken(t)
    setPayload(parseJwt(t))
  }

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY)
    setToken(null)
    setPayload(null)
  }

  const value = useMemo(() => ({ token, payload, login, logout }), [token, payload])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>')
  return ctx
}
