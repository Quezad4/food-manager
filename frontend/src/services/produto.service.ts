import { api } from './api'

export type Produto = { id: number; nome: string; descricao?: string | null; preco: number }

export async function listarProdutos(): Promise<Produto[]> {
  // ajuste o endpoint conforme seu backend: '/produto' ou '/produtos'
  const { data } = await api.get('/produtos')
  return data
}
