import { useEffect, useMemo, useState } from 'react'
import { Plus, Search } from 'lucide-react'
import Sidebar from '../../components/SideBar'
import Modal from '../../components/Modal'
import UserFormCreate, { type UserCreateValues } from '../../components/user/UserFormCreate'
import UserFormEdit, { type UserEditValues } from '../../components/user/UserFormEdit'

import {
  listarUsuarios,
  criarUsuario,
  atualizarUsuario,
  deletarUsuario,
  type Usuario,
} from '../../services/usuario.service'
import Header from '../../components/Header'

export default function FuncionariosPage() {
  // lista e busca
  const [lista, setLista] = useState<Usuario[]>([])
  const [busca, setBusca] = useState('')
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  // detalhes / edição
  const [openDetalhes, setOpenDetalhes] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [selecionado, setSelecionado] = useState<Usuario | null>(null)

  // criação
  const [openCreate, setOpenCreate] = useState(false)

  // carregar lista
  useEffect(() => {
    (async () => {
      try {
        setLoading(true)
        setErro(null)
        const users = await listarUsuarios()
        setLista(users)
      } catch (e: any) {
        setErro(e?.response?.data?.message || 'Falha ao carregar funcionários')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  // filtro
  const filtrados = useMemo(() => {
    const t = busca.trim().toLowerCase()
    if (!t) return lista
    return lista.filter((u) => `${u.id} ${u.nome} ${u.cargo ?? ''}`.toLowerCase().includes(t))
  }, [lista, busca])

  // abrir detalhes
  const abrirDetalhes = (u: Usuario) => {
    setSelecionado(u)
    setEditMode(false)
    setOpenDetalhes(true)
  }

  // handlers de criação/edição
  const handleCreate = async (values: UserCreateValues) => {
    try {
      const novo = await criarUsuario(values)
      setLista((prev) => [novo, ...prev])
      setOpenCreate(false)
    } catch (e: any) {
      alert(e?.response?.data?.message || 'Falha ao criar funcionário')
    }
  }

  const handleEdit = async (values: UserEditValues) => {
    if (!selecionado) return
    try {
      const upd = await atualizarUsuario(selecionado.id, values)
      setLista((prev) => prev.map((x) => (x.id === upd.id ? { ...x, ...upd } : x)))
      setOpenDetalhes(false)
    } catch (e: any) {
      alert(e?.response?.data?.message || 'Falha ao salvar alterações')
    }
  }

  const handleDelete = async () => {
    if (!selecionado) return
    if (!confirm(`Excluir "${selecionado.nome}"?`)) return
    try {
      await deletarUsuario(selecionado.id)
      setLista((prev) => prev.filter((x) => x.id !== selecionado.id))
      setOpenDetalhes(false)
    } catch (e: any) {
      alert(e?.response?.data?.message || 'Falha ao excluir')
    }
  }

  return (
    <div className="flex min-h-dvh">
      {/* conteúdo principal */}
      <div className="flex-1 bg-orange-50 p-6">
        <Header/>
        <div className="mx-auto w-full max-w-4xl rounded-2xl bg-orange-500 p-5 text-white shadow">
          {/* topo: busca + criar */}
          <div className="mb-6 flex items-center gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 rounded-full bg-white px-3 py-2 text-gray-700">
                <Search className="h-4 w-4" />
                <input
                  className="w-full rounded-full bg-transparent text-sm outline-none placeholder:text-gray-400"
                  placeholder="Pesquisar funcionários"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                />
              </div>
            </div>

            <button
              onClick={() => setOpenCreate(true)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-300 text-black hover:bg-yellow-200"
              title="Novo funcionário"
            >
              <Plus />
            </button>
          </div>

          {erro && (
            <p className="mb-3 rounded-md bg-black/20 px-3 py-2 text-sm">
              {erro}
            </p>
          )}

          {loading ? (
            <p className="px-2 py-6 text-center text-white/90">Carregando…</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {filtrados.map((u) => (
                <button
                  key={u.id}
                  onClick={() => abrirDetalhes(u)}
                  className="rounded-xl bg-yellow-200 p-3 text-left text-gray-900 shadow hover:bg-yellow-100"
                >
                  <div className="mb-2 font-semibold line-clamp-1">{u.nome}</div>
                  <div className="h-28 overflow-hidden rounded-md bg-white">
                    {u.fotoUrl ? (
                      <img
                        src={u.fotoUrl}
                        alt={u.nome}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm text-gray-500">
                        sem foto
                      </div>
                    )}
                  </div>
                  <div className="mt-2 text-sm text-gray-700">
                    {u.cargo || (u.isAdmin ? 'Administrador' : '—')}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* sidebar */}
      <Sidebar />

      {/* MODAL: detalhes (modo leitura) */}
      <Modal
        open={openDetalhes && !editMode}
        onClose={() => setOpenDetalhes(false)}
        title={selecionado?.nome || 'Funcionário'}
      >
        {selecionado && (
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="h-24 w-24 overflow-hidden rounded-md bg-gray-100">
                {selecionado.fotoUrl ? (
                  <img
                    src={selecionado.fotoUrl}
                    alt={selecionado.nome}
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>
              <div className="text-sm text-gray-700">
                <div>
                  <span className="font-semibold">Cargo:</span>{' '}
                  {selecionado.cargo ?? (selecionado.isAdmin ? 'Administrador' : '—')}
                </div>
                <div>
                  <span className="font-semibold">Telefone:</span>{' '}
                  {selecionado.telefone ?? '—'}
                </div>
                <div>
                  <span className="font-semibold">ID:</span> {selecionado.id}
                </div>
              </div>
            </div>

            <div className="mt-2 flex flex-col items-center gap-3">
              <button
                onClick={() => alert('Placeholder: gerar análises do atendente')}
                className="rounded-full bg-yellow-300 px-5 py-2 font-medium text-black hover:bg-yellow-200"
              >
                Gerar análises do atendente
              </button>
              <button
                onClick={() => setEditMode(true)}
                className="rounded-full bg-orange-600 px-5 py-2 font-medium text-white hover:bg-orange-700"
              >
                Editar perfil
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* MODAL: edição (form completo) */}
      <Modal
        open={openDetalhes && editMode}
        onClose={() => setOpenDetalhes(false)}
        title={selecionado ? `Editar ${selecionado.nome}` : 'Editar'}
      >
        {selecionado && (
          <UserFormEdit
            initial={{
              nome: selecionado.nome,
              cargo: selecionado.cargo,
              telefone: selecionado.telefone,
              fotoUrl: selecionado.fotoUrl,
              isAdmin: selecionado.isAdmin,
              user: (selecionado as any).user, // ajuste se o campo no seu back tiver outro nome
            }}
            onCancel={() => setOpenDetalhes(false)}
            onDelete={handleDelete}
            onSubmit={handleEdit}
          />
        )}
      </Modal>

      {/* MODAL: criação (form completo) */}
      <Modal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        title="Novo funcionário"
      >
        <UserFormCreate
          onCancel={() => setOpenCreate(false)}
          onSubmit={handleCreate}
        />
      </Modal>
    </div>
  )
}
