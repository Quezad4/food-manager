import { useEffect, useMemo, useState } from 'react'
import { Plus, Settings, Search } from 'lucide-react'
import Modal from '../../components/Modal'
import { criarProduto, listarProdutos, atualizarProduto, type Produto, deletarProduto } from '../../services/produto.service'
import Sidebar from '../../components/SideBar';
import Header from '../../components/Header';

function moneyBR(v: string | number) {
    const n = parseFloat(String(v))
    return Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 })
        .format(Number.isNaN(n) ? 0 : n)
}

export default function ProdutosPage() {
    const [produtos, setProdutos] = useState<Produto[]>([])
    const [busca, setBusca] = useState('')
    const [loading, setLoading] = useState(true)
    const [erro, setErro] = useState<string | null>(null)

    // modal create
    const [openCreate, setOpenCreate] = useState(false)
    const [cNome, setCNome] = useState('')
    const [cPreco, setCPreco] = useState<string>('') // manter string para input controlado
    const [cDesc, setCDesc] = useState('')

    // modal edit
    const [openEdit, setOpenEdit] = useState(false)
    const [edit, setEdit] = useState<Produto | null>(null)
    const [eNome, setENome] = useState('')
    const [ePreco, setEPreco] = useState<string>('')
    const [eDesc, setEDesc] = useState('')

    // carregar lista
    useEffect(() => {
        (async () => {
            try {
                setLoading(true)
                setErro(null)
                const lista = await listarProdutos()
                setProdutos(lista)
            } catch (e: any) {
                setErro(e?.response?.data?.message || 'Falha ao carregar produtos')
            } finally {
                setLoading(false)
            }
        })()
    }, [])

    const filtrados = useMemo(() => {
        const t = busca.trim().toLowerCase()
        if (!t) return produtos
        return produtos.filter(p => `${p.id} ${p.nome}`.toLowerCase().includes(t))
    }, [produtos, busca])

    const abrirCreate = () => {
        setCNome(''); setCPreco(''); setCDesc('')
        setOpenCreate(true)
    }
    const salvarCreate = async () => {
        try {
            const precoNumber = parseFloat(cPreco.replace(',', '.'))
            if (!cNome || Number.isNaN(precoNumber)) return alert('Preencha nome e preço válidos')
            const novo = await criarProduto({ nome: cNome, preco: precoNumber, descricao: cDesc || undefined })
            setProdutos(prev => [novo, ...prev])
            setOpenCreate(false)
        } catch (e: any) {
            alert(e?.response?.data?.message || 'Falha ao criar produto')
        }
    }

    const abrirEdit = (p: Produto) => {
        setEdit(p)
        setENome(p.nome)
        setEPreco(String(p.preco))
        setEDesc(p.descricao || '')
        setOpenEdit(true)
    }
    const salvarEdit = async () => {
        if (!edit) return
        try {
            const precoNumber = parseFloat(ePreco.replace(',', '.'))
            if (!eNome || Number.isNaN(precoNumber)) return alert('Preencha nome e preço válidos')
            const atualizado = await atualizarProduto(edit.id, { nome: eNome, preco: precoNumber, descricao: eDesc })
            // atualiza na lista
            setProdutos(prev => prev.map(p => (p.id === edit.id ? { ...p, ...atualizado } : p)))
            setOpenEdit(false)
        } catch (e: any) {
            alert(e?.response?.data?.message || 'Falha ao atualizar produto')
        }
    }

    return (

        <div className="flex min-h-dvh">
            {/* conteúdo principal com o “cartão” laranja */}
            <div className="flex-1 bg-orange-50 p-6">
                <Header />
                <div className="mx-auto w-full max-w-2xl rounded-2xl bg-orange-500 p-5 text-white shadow">
                    {/* topo: busca + botão criar */}
                    <div className="mb-4 flex items-center gap-3">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 rounded-full bg-white px-3 py-2 text-gray-700">
                                <Search className="h-4 w-4" />
                                <input
                                    className="w-full rounded-full bg-transparent text-sm outline-none placeholder:text-gray-400"
                                    placeholder="Pesquisar produto"
                                    value={busca}
                                    onChange={(e) => setBusca(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            onClick={abrirCreate}
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-300 text-black hover:bg-yellow-200"
                            title="Novo produto"
                        >
                            <Plus />
                        </button>
                    </div>

                    {erro && <p className="mb-3 rounded-md bg-black/20 px-3 py-2 text-sm">{erro}</p>}

                    {loading ? (
                        <p className="px-2 py-6 text-center text-white/90">Carregando…</p>
                    ) : (
                        <ul className="space-y-3">
                            {filtrados.map((p) => (
                                <li key={p.id} className="flex items-center justify-between rounded-full bg-white px-4 py-2 text-gray-900 shadow">
                                    {/* ID — Nome */}
                                    <span className="truncate text-sm">
                                        <span className="mr-2 font-semibold tabular-nums">{p.id}</span> — {p.nome}
                                    </span>

                                    <div className="ml-2 flex items-center gap-4">
                                        <span className="font-medium">{moneyBR(p.preco)}</span>
                                        <button
                                            onClick={() => abrirEdit(p)}
                                            className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100"
                                            title="Editar"
                                        >
                                            <Settings className="h-4 w-4" />
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {/* (opcional) sua sidebar fixa aqui, se tiver */}
            {/* ... */}

            {/* MODAL: criar */}
            <Modal open={openCreate} onClose={() => setOpenCreate(false)} title="Novo produto">
                <div className="space-y-3">
                    <div>
                        <label className="mb-1 block text-sm font-medium">Nome</label>
                        <input className="w-full rounded-lg border px-3 py-2 outline-none focus:border-orange-600"
                            value={cNome} onChange={(e) => setCNome(e.target.value)} />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium">Preço</label>
                        <input className="w-full rounded-lg border px-3 py-2 outline-none focus:border-orange-600"
                            placeholder="ex: 24,90" value={cPreco} onChange={(e) => setCPreco(e.target.value)} />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium">Descrição (opcional)</label>
                        <textarea className="w-full rounded-lg border px-3 py-2 outline-none focus:border-orange-600"
                            rows={3} value={cDesc} onChange={(e) => setCDesc(e.target.value)} />
                    </div>
                    <div className="mt-4 flex justify-end gap-2">
                        <button onClick={() => setOpenCreate(false)} className="rounded-lg border px-3 py-2 text-sm">Cancelar</button>
                        <button onClick={salvarCreate} className="rounded-lg bg-orange-600 px-3 py-2 text-sm font-medium text-white hover:bg-orange-700">Salvar</button>
                    </div>
                </div>
            </Modal>

            {/* MODAL: editar */}
            <Modal open={openEdit} onClose={() => setOpenEdit(false)} title={`Editar produto #${edit?.id ?? ''}`}>
                <div className="space-y-3">
                    <div>
                        <label className="mb-1 block text-sm font-medium">Nome</label>
                        <input
                            className="w-full rounded-lg border px-3 py-2 outline-none focus:border-orange-600"
                            value={eNome}
                            onChange={(e) => setENome(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium">Preço</label>
                        <input
                            className="w-full rounded-lg border px-3 py-2 outline-none focus:border-orange-600"
                            value={ePreco}
                            onChange={(e) => setEPreco(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium">Descrição</label>
                        <textarea
                            className="w-full rounded-lg border px-3 py-2 outline-none focus:border-orange-600"
                            rows={3}
                            value={eDesc}
                            onChange={(e) => setEDesc(e.target.value)}
                        />
                    </div>

                    {/* botões */}
                    <div className="mt-6 flex justify-between items-center">
                        {/* Botão excluir */}
                        <button
                            onClick={async () => {
                                if (!edit) return
                                const confirm = window.confirm(`Tem certeza que deseja excluir "${edit.nome}"?`)
                                if (!confirm) return
                                try {
                                    await deletarProduto(edit.id)
                                    setProdutos((prev) => prev.filter((p) => p.id !== edit.id))
                                    setOpenEdit(false)
                                } catch (e: any) {
                                    alert(e?.response?.data?.message || 'Falha ao excluir produto')
                                }
                            }}
                            className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
                        >
                            Excluir
                        </button>

                        {/* grupo salvar/cancelar */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => setOpenEdit(false)}
                                className="rounded-lg border px-3 py-2 text-sm"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={salvarEdit}
                                className="rounded-lg bg-orange-600 px-3 py-2 text-sm font-medium text-white hover:bg-orange-700"
                            >
                                Salvar
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>

            <Sidebar />
        </div>
    )
}
