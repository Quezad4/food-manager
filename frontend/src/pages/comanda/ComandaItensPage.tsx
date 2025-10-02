import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { listarProdutos, type Produto } from '../../services/produto.service'
import { adicionarItemComanda } from '../../services/comanda.service'
import { Check, ChevronLeft, Minus, Plus, Search } from 'lucide-react'

export default function ComandaItensPage() {
    const { id } = useParams()
    const comandaId = Number(id)
    const navigate = useNavigate()

    const [produtos, setProdutos] = useState<Produto[]>([])
    const [qtd, setQtd] = useState<Record<number, number>>({})
    const [buscar, setBuscar] = useState('')
    const [loading, setLoading] = useState(true)
    const [finalizando, setFinalizando] = useState(false)
    const [erro, setErro] = useState<string | null>(null)

    useEffect(() => {
        (async () => {
            try {
                setLoading(true)
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
        const termo = buscar.trim().toLowerCase()
        if (!termo) return produtos
        return produtos.filter((p) => p.nome.toLowerCase().includes(termo))
    }, [produtos, buscar])

    const inc = (pid: number) => setQtd((s) => ({ ...s, [pid]: (s[pid] || 0) + 1 }))
    const dec = (pid: number) =>
        setQtd((s) => {
            const atual = (s[pid] || 0) - 1
            return { ...s, [pid]: Math.max(0, atual) }
        })

    const finalizar = async () => {
        try {
            setFinalizando(true)
            setErro(null)
            const entries = Object.entries(qtd).filter(([, v]) => v > 0)
            if (entries.length === 0) {
                navigate(-1)
                return
            }
            for (const [produtoIdStr, quantidade] of entries) {
                await adicionarItemComanda({
                    comandaId,
                    produtoId: Number(produtoIdStr),
                    quantidade,
                })
            }
            navigate(-1) 
        } catch (e: any) {
            setErro(e?.response?.data?.message || 'Falha ao finalizar operação')
        } finally {
            setFinalizando(false)
        }
    }

    return (
        <div className="min-h-dvh bg-orange-50">
            <header className="flex items-center justify-center bg-orange-500 py-4 text-white">
                <h1 className="text-2xl font-semibold">Comanda {comandaId}</h1>
            </header>

            <div className="mx-auto mt-6 w-full max-w-3xl rounded-2xl bg-orange-500 p-4 text-white shadow">
                {/* topo: voltar | busca | finalizar */}
                <div className="mb-4 flex items-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-black/10"
                        aria-label="Voltar"
                    >
                        <ChevronLeft />
                    </button>

                    <div className="flex-1">
                        <div className="flex items-center gap-2 rounded-full bg-white px-3 py-2 text-gray-700">
                            <Search className="h-4 w-4" />
                            <input
                                className="w-full rounded-full bg-transparent text-sm outline-none placeholder:text-gray-400"
                                placeholder="Pesquisar produto"
                                value={buscar}
                                onChange={(e) => setBuscar(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        onClick={finalizar}
                        disabled={finalizando}
                        title="Finalizar"
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-300 text-black hover:bg-yellow-200 disabled:opacity-70"
                    >
                        <Check />
                    </button>
                </div>

                {erro && <p className="mb-3 rounded-md bg-black/20 px-3 py-2 text-sm">{erro}</p>}
                {loading ? (
                    <p className="px-2 py-6 text-center text-white/90">Carregando produtos…</p>
                ) : (
                    <ul className="space-y-3">
                        {filtrados.map((p) => (
                            <li
                                key={p.id}
                                className="flex items-center justify-between rounded-full bg-white px-4 py-2 text-gray-900 shadow"
                            >
                                <span className="truncate">{p.nome}</span>
                                <div className="ml-2 flex items-center gap-3">
                                    <span className="font-medium">
                                        {Intl.NumberFormat('pt-BR', {
                                            style: 'currency',
                                            currency: 'BRL',
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        }).format(parseFloat(String(p.preco)))}
                                    </span>

                                    <button
                                        onClick={() => dec(p.id)}
                                        className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100"
                                        aria-label={`Remover ${p.nome}`}
                                    >
                                        <Minus className="h-4 w-4" />
                                    </button>

                                    <button
                                        onClick={() => inc(p.id)}
                                        className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100"
                                        aria-label={`Adicionar ${p.nome}`}
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>

                                    <span className="w-6 text-center tabular-nums">{qtd[p.id] || 0}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}
