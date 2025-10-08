import { useEffect, useState } from 'react'

export type UserEditValues = {
  nome: string
  cargo?: string
  telefone?: string
  fotoUrl?: string
  isAdmin?: boolean
  user?: string
  senha?: string // opcional; se vazio, não altera
}

export default function UserFormEdit({
  initial,
  onSubmit,
  onCancel,
  onDelete,
  submitting = false,
}: {
  initial: {
    nome: string; cargo?: string | null; telefone?: string | null;
    fotoUrl?: string | null; isAdmin?: boolean; user?: string | null;
  }
  onSubmit: (values: UserEditValues) => void | Promise<void>
  onCancel: () => void
  onDelete?: () => void
  submitting?: boolean
}) {
  const [nome, setNome] = useState(initial.nome)
  const [cargo, setCargo] = useState(initial.cargo || '')
  const [telefone, setTelefone] = useState(initial.telefone || '')
  const [fotoUrl, setFotoUrl] = useState(initial.fotoUrl || '')
  const [user, setUser] = useState(initial.user || '')
  const [senha, setSenha] = useState('')
  const [isAdmin, setIsAdmin] = useState(!!initial.isAdmin)

  useEffect(() => {
    setNome(initial.nome)
    setCargo(initial.cargo || '')
    setTelefone(initial.telefone || '')
    setFotoUrl(initial.fotoUrl || '')
    setUser(initial.user || '')
    setSenha('')
    setIsAdmin(!!initial.isAdmin)
  }, [initial])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nome.trim()) return alert('Informe o nome')
    onSubmit({
      nome: nome.trim(),
      cargo: cargo || undefined,
      telefone: telefone || undefined,
      fotoUrl: fotoUrl || undefined,
      user: user || undefined,
      senha: senha || undefined, // só envia se preenchida
      isAdmin,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="mb-1 block text-sm font-medium">Nome*</label>
        <input className="w-full rounded-lg border px-3 py-2 outline-none focus:border-orange-600"
               value={nome} onChange={(e) => setNome(e.target.value)} />
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Cargo</label>
          <input className="w-full rounded-lg border px-3 py-2 outline-none focus:border-orange-600"
                 value={cargo} onChange={(e) => setCargo(e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Telefone</label>
          <input className="w-full rounded-lg border px-3 py-2 outline-none focus:border-orange-600"
                 value={telefone} onChange={(e) => setTelefone(e.target.value)} />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Foto (URL)</label>
        <input className="w-full rounded-lg border px-3 py-2 outline-none focus:border-orange-600"
               value={fotoUrl} onChange={(e) => setFotoUrl(e.target.value)} />
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Usuário (login)</label>
          <input className="w-full rounded-lg border px-3 py-2 outline-none focus:border-orange-600"
                 value={user} onChange={(e) => setUser(e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Senha</label>
          <input type="password" className="w-full rounded-lg border px-3 py-2 outline-none focus:border-orange-600"
                 value={senha} onChange={(e) => setSenha(e.target.value)} />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)} />
        Administrador
      </label>

      <div className="mt-6 flex justify-between items-center">
        {onDelete && (
          <button type="button" onClick={onDelete}
                  className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700">
            Excluir
          </button>
        )}
        <div className="flex gap-2">
          <button type="button" onClick={onCancel} className="rounded-lg border px-3 py-2 text-sm">Cancelar</button>
          <button type="submit" disabled={submitting}
                  className="rounded-lg bg-orange-600 px-3 py-2 text-sm font-medium text-white hover:bg-orange-700 disabled:opacity-70">
            {submitting ? 'Salvando…' : 'Salvar'}
          </button>
        </div>
      </div>
    </form>
  )
}
