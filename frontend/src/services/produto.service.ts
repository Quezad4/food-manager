import { api } from './api'

export type Produto = { id: number; nome: string; descricao?: string | null; preco: number }

export async function listarProdutos(): Promise<Produto[]> {
  // ajuste o endpoint conforme seu backend: '/produto' ou '/produtos'
  const { data } = await api.get('/produtos')
  return data
}


export async function criarProduto(input: { nome: string; preco: number; descricao?: string }) {
  const { data } = await api.post('/produtos', input)
  return data as Produto
}

export async function atualizarProduto(id: number, input: { nome?: string; preco?: number; descricao?: string }) {
  const { data } = await api.patch(`/produtos/${id}`, input)
  return data as Produto
}

export async function deletarProduto(id: number) {
  const { data } = await api.delete(`/produtos/${id}`)
  return data
}
