import { useState } from 'react'
import { fileToDataURL } from '../../util/image'



export type UserCreateValues = {
  nome: string
  cargo?: string
  telefone?: string
  foto?: string
  isAdmin?: boolean
  user?: string
  senha?: string
}

export default function UserFormCreate({
  onSubmit,
  onCancel,
  submitting = false,
}: {
  onSubmit: (values: UserCreateValues) => void | Promise<void>
  onCancel: () => void
  submitting?: boolean
}) {
  const [nome, setNome] = useState('')
  const [cargo, setCargo] = useState('')
  const [telefone, setTelefone] = useState('')
  const [foto, setFoto] = useState('')
  const [user, setUser] = useState('')
  const [senha, setSenha] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [fileInputId] = useState(() => `foto-input-${Math.random().toString(36).slice(2)}`)
  const [uploadErro, setUploadErro] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nome.trim()) return alert('Informe o nome')
    if (!user) return alert('Informe o user')
    if (!senha) return alert('Informe o senha')
    onSubmit({
      nome: nome.trim(),
      cargo: cargo || undefined,
      telefone: telefone || undefined,
      foto: foto || undefined, 
      user: user, 
      senha: senha, 
      isAdmin,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="mb-1 block text-sm font-medium">Nome*</label>
        <input
          className="w-full rounded-lg border px-3 py-2 outline-none focus:border-orange-600"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Cargo</label>
          <input
            className="w-full rounded-lg border px-3 py-2 outline-none focus:border-orange-600"
            value={cargo}
            onChange={(e) => setCargo(e.target.value)}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Telefone</label>
          <input
            className="w-full rounded-lg border px-3 py-2 outline-none focus:border-orange-600"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Foto</label>

        {foto ? (
          <div className="mb-2 h-28 w-28 overflow-hidden rounded-md bg-gray-100">
            <img src={foto} alt="Prévia" className="h-full w-full object-cover" />
          </div>
        ) : null}

        <div className="flex gap-2">
          <input
            id={fileInputId}
            type="file"
            accept="image/*"
            capture
            className="hidden"
            onChange={async (e) => {
              setUploadErro(null)
              const f = e.target.files?.[0]
              if (!f) return
              try {
                const dataUrl = await fileToDataURL(f, 512)
                setFoto(dataUrl)
              } catch (err: any) {
                setUploadErro(err?.message || 'Falha ao processar a imagem')
              }
            }}
          />
          <label
            htmlFor={fileInputId}
            className="cursor-pointer rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
          >
            {foto?  "Trocar foto" : "Adicionar Foto"}
          </label>

          <button
            type="button"
            onClick={() => setFoto('')}
            className="rounded-lg border px-3 py-2 text-sm"
          >
            Remover
          </button>
        </div>

        {uploadErro && <p className="mt-1 text-sm text-red-600">{uploadErro}</p>}

      
        <p className="mt-1 text-xs text-gray-500">Fotos menores que 2MB</p>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Usuário (login)*</label>
          <input
            className="w-full rounded-lg border px-3 py-2 outline-none focus:border-orange-600"
            value={user}
            onChange={(e) => setUser(e.target.value)}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Senha*</label>
          <input
            type="password"
            className="w-full rounded-lg border px-3 py-2 outline-none focus:border-orange-600"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)} />
        Administrador
      </label>

      <div className="mt-6 flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="rounded-lg border px-3 py-2 text-sm">
          Cancelar
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-orange-600 px-3 py-2 text-sm font-medium text-white hover:bg-orange-700 disabled:opacity-70"
        >
          {submitting ? 'Salvando…' : 'Salvar'}
        </button>
      </div>
    </form>
  )
}
