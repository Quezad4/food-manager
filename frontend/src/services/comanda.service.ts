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


export async function obterDetalhesComanda(comandaId: number): Promise<ComandaDetalhes> {
  const { data } = await api.get(`/comandas/${comandaId}`)
  return data
}

export async function fecharComanda(comandaId: number) {

  const { data } = await api.patch(`/comandas/fechar/${comandaId}`)
  return data

  
}
