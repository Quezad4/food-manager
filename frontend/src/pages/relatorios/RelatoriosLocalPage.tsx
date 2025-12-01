import { useEffect, useMemo, useState } from 'react'
import Header from '../../components/Header'
import Sidebar from '../../components/SideBar'
import {
  listarComandas,
  obterDetalhesComanda,
  type ComandaDetalhes,
  type ComandaResumo,
} from '../../services/comanda.service'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts'

// ===== Helpers
function moneyBR(n: number) {
  return Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n || 0)
}
function fmtISODate(d: Date) {
  // yyyy-mm-dd
  return d.toISOString().slice(0, 10)
}
function parseNum(v: string | number | null | undefined): number {
  const n = Number(v)
  return Number.isFinite(n) ? n : 0
}

async function mapWithConcurrency<T, R>(arr: T[], limit: number, fn: (x: T) => Promise<R>): Promise<R[]> {
  const ret: R[] = []
  let i = 0
  const workers = Array.from({ length: Math.min(limit, arr.length) }, async () => {
    while (i < arr.length) {
      const idx = i++
      ret[idx] = await fn(arr[idx])
    }
  })
  await Promise.all(workers)
  return ret
}

// ===== Page
export default function RelatoriosLocalPage() {
  // filtros simples de período (aplicados no front)
  const hoje = new Date()
  const primeiroDiaMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1)

  const [de, setDe] = useState<string>(fmtISODate(primeiroDiaMes))
  const [ate, setAte] = useState<string>(fmtISODate(hoje))

  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)


  const [detalhes, setDetalhes] = useState<ComandaDetalhes[]>([])

  const [detalhes2, setDetalhes2] = useState<ComandaResumo[]>([])
  const [detalhes3, setDetalhes3] = useState<ComandaResumo[]>([])
 

  // KPIs e gráficos (derivados)
  const kpis = useMemo(() => {
    const totalFaturado = detalhes.reduce((acc, c) => acc + parseNum(c.total), 0)
    const ticketMedio = detalhes.length ? totalFaturado / detalhes.length : 0
  
    return {
      abertas: detalhes3.length,
      fechadas: detalhes.length,
      faturado: totalFaturado,
      ticketMedio,
    }
  }, [detalhes])

  const topItens = useMemo(() => {
    const map = new Map<number, { nome: string; quantidade: number; faturamento: number }>()
    for (const c of detalhes) {
      for (const it of c.itens || []) {
        const id = it.produto?.id ?? it.id // ajuste se necessário
        const nome = it.produto?.nome ?? `#${id}`
        const q = parseNum(it.quantidade)
        const fat = parseNum(it.subtotal)
        const prev = map.get(id) || { nome, quantidade: 0, faturamento: 0 }
        prev.quantidade += q
        prev.faturamento += fat
        map.set(id, prev)
      }
    }
    // Ordena por quantidade desc e pega top 10
    return [...map.entries()]
      .map(([produtoId, v]) => ({ produtoId, ...v }))
      .sort((a, b) => b.quantidade - a.quantidade)
      .slice(0, 10)
  }, [detalhes])

  const faturamentoDiario = useMemo(() => {
    // Map dia(yyyy-mm-dd) -> total
    const map = new Map<string, number>()
    for (const c of detalhes2) {
      // use c.fechadaEm se existir; senão abertaEm
      const dataRef = c.fechadaEm ?? c.criadaEm ?? null
      if (!dataRef) continue
      const dia = fmtISODate(new Date(dataRef))
      map.set(dia, (map.get(dia) ?? 0) + parseNum(c.total))
    }
    return [...map.entries()]
      .map(([dia, total]) => ({ dia, total }))
      .sort((a, b) => (a.dia < b.dia ? -1 : 1))
  }, [detalhes])

  // Carregar/atualizar
  const carregar = async () => {
    try {
      setLoading(true)
      setErro(null)

  
      const lista = await listarComandas()
      const listaFechada = lista.filter(comanda => comanda.status === "FECHADA")
      const listaAberta = lista.filter(comanda => comanda.status === "ABERTA")
      console.log(listaFechada)
      // filtro front por data (com base em fechadaEm ou abertaEm)
      const ini = de ? new Date(de + 'T00:00:00') : null
      const fim = ate ? new Date(ate + 'T23:59:59') : null

      const listaFiltrada = listaFechada.filter((c) => {
        const ref = (c as any).fechadaEm
        if (!ref) return true
        const d = new Date(ref)
        if (ini && d < ini) return false
        if (fim && d > fim) return false
        return true
      })
      const listaFiltrada2 = listaAberta.filter((c) => {
        const ref = (c as any).fechadaEm
        if (!ref) return true
        const d = new Date(ref)
        if (ini && d < ini) return false
        if (fim && d > fim) return false
        return true
      })



      const detalhesArr = await mapWithConcurrency(
        listaFiltrada.map((c) => c.id),
        5,
        async (id) => await obterDetalhesComanda(id)
      )
      setDetalhes(detalhesArr)
      setDetalhes2(listaFiltrada)
      setDetalhes3(listaFiltrada2)
    } catch (e: any) {
      setErro(e?.response?.data?.message || 'Falha ao carregar relatórios (front)')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { carregar() }, []) // carrega ao abrir

  return (
    <div className="flex min-h-dvh">
      <div className="flex-1 bg-orange-50">
        <Header />

        <div className="mx-auto w-full max-w-6xl p-6">
          {/* filtros */}
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end">
            <div>
              <label className="mb-1 block text-sm font-medium">De</label>
              <input
                type="date"
                value={de}
                onChange={(e) => setDe(e.target.value)}
                className="rounded-lg border px-3 py-2 outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Até</label>
              <input
                type="date"
                value={ate}
                onChange={(e) => setAte(e.target.value)}
                className="rounded-lg border px-3 py-2 outline-none"
              />
            </div>
            <button
              onClick={carregar}
              className="h-10 rounded-lg bg-orange-600 px-4 text-white hover:bg-orange-700"
            >
              Atualizar
            </button>
          </div>

          {erro && <p className="mb-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{erro}</p>}

          {/* KPIs */}
          <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            <KpiCard titulo="Comandas Abertas" valor={kpis.abertas} />
            <KpiCard titulo="Comandas Fechadas" valor={kpis.fechadas} />
            <KpiCard titulo="Faturamento" valor={moneyBR(kpis.faturado)} />
            <KpiCard titulo="Ticket Médio" valor={moneyBR(kpis.ticketMedio)} />
          </div>

          {/* Top Itens */}
          <div className="mb-6 rounded-2xl bg-white p-4 shadow">
            <div className="mb-3 text-lg font-semibold">Itens mais vendidos (quantidade)</div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topItens}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="nome" interval={0} tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip formatter={(v: any, name: string) => [v, name === 'quantidade' ? 'Qtd' : name]} />
                  <Bar dataKey="quantidade" fill='#FAB22F'/>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mb-6 rounded-2xl bg-white p-4 shadow">
            <div className="mb-3 text-lg font-semibold">Faturamento diário</div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={faturamentoDiario}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="dia" />
                  <YAxis />
                  <Tooltip formatter={(v: any) => moneyBR(Number(v))} />
                  <Line type="monotone" dataKey="total" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>




          {loading && (
            <div className="rounded-xl bg-white/70 px-4 py-4 text-center text-gray-600 shadow">
              Atualizando…
            </div>
          )}
        </div>
      </div>

      <Sidebar />
    </div>
  )
}

function KpiCard({ titulo, valor }: { titulo: string; valor: string | number }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow">
      <div className="text-sm text-gray-500">{titulo}</div>
      <div className="mt-1 text-2xl font-semibold">{valor}</div>
    </div>
  )
}
