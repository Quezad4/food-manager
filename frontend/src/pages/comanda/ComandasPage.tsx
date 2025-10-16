import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/Header'
import Sidebar from '../../components/SideBar'
import { listarComandas, type ComandaResumo } from '../../services/comanda.service'

function moneyBR(v: string | number) {
  const n = parseFloat(String(v))
  return Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 }).format(Number.isNaN(n) ? 0 : n)
}

function badgeColor(status: ComandaResumo['status']) {
  switch (status) {
    case 'ABERTA': return 'bg-emerald-100 text-emerald-700'
    case 'FECHADA': return 'bg-gray-200 text-gray-700'
    default: return 'bg-gray-100 text-gray-700'
  }
}

export default function ComandasPage() {
  const navigate = useNavigate()

  // ABERTA | FECHADA
  const [filtro, setFiltro] = useState<'ABERTA' | 'FECHADA'>('ABERTA')

  const [lista, setLista] = useState<ComandaResumo[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  // carrega quando o filtro muda
  useEffect(() => {
    (async () => {
      try {
        setLoading(true); setErro(null)
        const res = await listarComandas({ status: filtro })
        setLista(res)
      } catch (e: any) {
        setErro(e?.response?.data?.message || 'Falha ao carregar comandas')
      } finally {
        setLoading(false)
      }
    })()
  }, [filtro])

  // fallback: se o backend ainda não filtrar por status, filtramos aqui também
  const exibidas = useMemo(
    () => lista.filter(c => c.status === filtro),
    [lista, filtro]
  )

  return (
    <div className="flex min-h-dvh">
      <div className="flex-1 bg-orange-50">
        <Header />

        <div className="mx-auto w-full max-w-5xl p-6">
            
          <div className="mb-5 flex gap-3">
            <button
              onClick={() => setFiltro('ABERTA')}
              className={`rounded-full px-4 py-2 text-sm font-medium shadow-sm transition
                ${filtro === 'ABERTA'
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border'}`}
            >
              Abertas
            </button>
            <button
              onClick={() => setFiltro('FECHADA')}
              className={`rounded-full px-4 py-2 text-sm font-medium shadow-sm transition
                ${filtro === 'FECHADA'
                  ? 'bg-gray-700 text-white hover:bg-gray-800'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border'}`}
            >
              Fechadas
            </button>
          </div>

          {erro && <p className="mb-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{erro}</p>}

          {loading ? (
            <p className="rounded-xl bg-white/70 px-4 py-16 text-center text-gray-600 shadow">
              Carregando…
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {exibidas.map((c) => (
                <button
                  key={c.id}
                  onClick={() => navigate(`/comanda/${c.id}/detalhes`)}
                  className="group rounded-2xl bg-white p-4 text-left shadow hover:shadow-md"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <div className="text-lg font-semibold">Comanda #{c.id}</div>
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${badgeColor(c.status)}`}>
                      {c.status}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-sm text-gray-700">
                    <span>Total</span>
                    <span className="font-semibold">{moneyBR(c.total)}</span>
                  </div>

                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-500">
                    <div>
                      <div className="uppercase tracking-wide">Abertura</div>
                      <div>{c.criadaEm ? new Date(c.criadaEm).toLocaleString('pt-BR') : '—'}</div>
                    </div>
                    <div>
                      <div className="uppercase tracking-wide">Fechamento</div>
                      <div>{c.fechadaEm ? new Date(c.fechadaEm).toLocaleString('pt-BR') : '—'}</div>
                    </div>
                  </div>

                  <div className="mt-3 text-right text-xs text-gray-400 group-hover:text-gray-500">
                    Toque para ver detalhes →
                  </div>
                </button>
              ))}

              {!exibidas.length && (
                <div className="rounded-2xl bg-white p-8 text-center text-gray-500 shadow">
                  Nenhuma comanda {filtro === 'ABERTA' ? 'aberta' : 'fechada'} encontrada.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* barra lateral */}
      <Sidebar />
    </div>
  )
}
