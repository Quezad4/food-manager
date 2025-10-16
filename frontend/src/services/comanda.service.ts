import { api } from './api'


export type ItemComanda = {
  id: number
  quantidade: number
  precoUnitario: string | number
  subtotal: string | number
  produto: { id: number; nome: string }
}

export type ComandaDetalhes = {
  id: number
  status: string
  total: string | number
  itens: ItemComanda[]
}



export async function adicionarItemComanda(params: {
  comandaId: number
  produtoId: number
  quantidade: number
}) {

  const { data } = await api.post('comandas/adicionar-item', {
    comandaId: params.comandaId,
    produtoId: params.produtoId,
    quantidade: params.quantidade,
  })
  return data
}



export type StatusComanda = 'ABERTA' | 'FECHADA' | 'CANCELADA';

export type Comanda = {
  id: number;
  usuarioId: number;
  status: StatusComanda;
  total: string;
  criadaEm: string;
  fechadaEm?: string | null;
};

export type ComandaResumo = {
  id: number
  usuarioId?: number | null
  status: StatusComanda
  total: string | number
  criadaEm?: string | null
  fechadaEm?: string | null
}


export async function getComandaById(id: number) {
  const r = await api.get(`/comandas/${id}`);
  return r.data as Comanda;
}
export async function abrirComanda(usuarioId: number) {
  const r = await api.post('/comandas/abrir', { usuarioId });
  return r.data as Comanda;
}

export async function obterDetalhesComanda(comandaId: number): Promise<ComandaDetalhes> {
  const { data } = await api.get(`/comandas/${comandaId}`)
  return data
}

export async function fecharComanda(comandaId: number) {

  const { data } = await api.patch(`/comandas/fechar/${comandaId}`)
  return data


}

export async function listarComandas(params?: {
  q?: string
  status?: ComandaResumo['status'] | 'ABERTAS' // ativas = não fechadas/canceladas
  page?: number
  perPage?: number
}): Promise<ComandaResumo[]> {
  const { data } = await api.get('/comandas', { params })
  return data
}
