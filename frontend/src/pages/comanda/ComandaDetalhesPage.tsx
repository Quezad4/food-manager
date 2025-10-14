import { useEffect,  useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fecharComanda, obterDetalhesComanda, type ItemComanda } from '../../services/comanda.service'
import { ChevronLeft } from 'lucide-react'

function moneyBR(v: string | number) {
  const n = parseFloat(String(v))
  return Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number.isNaN(n) ? 0 : n)
}

export default function ComandaDetalhesPage() {
  const { id } = useParams()
  const comandaId = Number(id)
  const navigate = useNavigate()

  const [itens, setItens] = useState<ItemComanda[]>([])
  const [total, setTotal] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [encerrando, setEncerrando] = useState(false)

  useEffect(() => {
    (async () => {
      try {
        setLoading(true)
        setErro(null)
        const det = await obterDetalhesComanda(comandaId)
        setItens(det.itens ?? [])
        setTotal(parseFloat(String(det.total ?? 0)))
      } catch (e: any) {
        setErro(e?.response?.data?.message || 'Falha ao carregar a comanda')
      } finally {
        setLoading(false)
      }
    })()
  }, [comandaId])

  
 

  const encerrar = async () => {
    try {
      setEncerrando(true)
      setErro(null)
      await fecharComanda(comandaId)
      navigate(-1) 
    } catch (e: any) {
      setErro(e?.response?.data?.message || 'Falha ao encerrar a comanda')
    } finally {
      setEncerrando(false)
    }
  }

  return (
    <div className="min-h-dvh bg-orange-50">
      <header className="flex items-center justify-center bg-orange-500 py-4 text-white relative">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full p-1 hover:bg-white/10"
          aria-label="Voltar"
        >
          <ChevronLeft />
        </button>
        <h1 className="text-2xl font-semibold">Comanda {comandaId}</h1>
      </header>

      <div className="mx-auto mt-6 w-full max-w-2xl rounded-2xl bg-orange-500 p-5 text-white shadow">
        {erro && <p className="mb-3 rounded-md bg-black/20 px-3 py-2 text-sm">{erro}</p>}

        {loading ? (
          <p className="px-2 py-6 text-center text-white/90">Carregando…</p>
        ) : (
          <>
            <ul className="space-y-3">
              {itens.map((i) => (
                <li
                  key={i.id}
                  className="flex items-center justify-between rounded-full bg-white px-4 py-2 text-gray-900 shadow"
                >
                  <span className="truncate text-sm">
                    <span className="mr-2 font-semibold tabular-nums">
                      {String(i.quantidade).padStart(2, '0')}x
                    </span>
                    {i.produto?.nome ?? '—'}
                    
                  </span>
                  <span className="font-medium">{moneyBR(i.subtotal)}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex items-center justify-end pr-2">
              <span className="rounded-lg bg-white px-4 py-2 text-xl font-semibold text-gray-900 shadow">
                Total: {moneyBR(total || itens.reduce((acc, i) => acc + Number(i.subtotal), 0))}
              </span>
            </div>

            <div className="mt-6 flex justify-center">
              <button
                onClick={encerrar}
                disabled={encerrando}
                className="rounded-full bg-yellow-300 px-6 py-2 font-medium text-black hover:bg-yellow-200 disabled:opacity-70"
              >
                {encerrando ? 'Encerrando…' : 'Encerrar Comanda'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
