import { api } from './api'

export type Usuario = {
  id: number
  nome: string
  cargo?: string | null
  telefone?: string | null
  foto?: string | null
  isAdmin?: boolean
}

export async function listarUsuarios(): Promise<Usuario[]> {
  const { data } = await api.get('/usuario') // ajuste se no seu back for /usuario
  return data
}

export async function criarUsuario(input: {
  nome: string
  cargo?: string
  telefone?: string
  foto?: string
  isAdmin?: boolean
  user?: string
  senha?: string
}) {
  const { data } = await api.post('/usuario', input)
  return data as Usuario
}

export async function atualizarUsuario(id: number, input: Partial<Usuario>) {
  console.log("input",input)
  console.log(id)
  const { data } = await api.patch(`/usuario/${id}`, input)
  return data as Usuario
}

export async function deletarUsuario(id: number) {
    const { data } = await api.delete(`/usuario/${id}`)
    return data
  }
  