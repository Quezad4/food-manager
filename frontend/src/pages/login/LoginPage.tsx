import { Lock, User } from 'lucide-react'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../modules/auth/AuthContext'

export default function LoginPage() {
  const [user, setUser] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation() as any

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login(user, password)
      const from = location.state?.from?.pathname || '/home'
      navigate(from, { replace: true })
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Falha no login'
      setError(Array.isArray(msg) ? msg.join(', ') : msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-dvh grid place-items-center bg-orange-100 p-4 text-gray-900">
      <div className="w-full max-w-xl rounded-2xl bg-white/60 p-8 shadow">
        <h1 className="mb-10 text-3xl font-semibold">
          <span className="bg-orange-500 px-2 text-white">FOOD</span> MANAGER
        </h1>

        <form onSubmit={onSubmit} className="mt-12 space-y-6">
          <div>
            <div className="flex items-center rounded-full border border-orange-600 bg-orange-500/90 px-3">
              <span className="mr-2"><User color="#FFFFFF" /></span>
              <input
                className="w-full rounded-full bg-transparent px-1 py-2 text-white placeholder-white/80 outline-none"
                placeholder="usuário"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                autoComplete="username"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center rounded-full border border-orange-600 bg-orange-500/90 px-3">
              <span className="mr-2"><Lock color="#FFFFFF" /></span>
              <input
                type="password"
                className="w-full rounded-full bg-transparent px-1 py-2 text-white placeholder-white/80 outline-none"
                placeholder="senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mx-auto block rounded-full border border-orange-700 bg-orange-500 px-6 py-2 font-medium text-white shadow disabled:opacity-70"
          >
            {loading ? 'Entrando…' : 'Entrar'}
          </button>

          <p className="mt-4 text-center text-xs text-gray-600">
           
          </p>

  
        </form>
      </div>
    </main>
  )
}
