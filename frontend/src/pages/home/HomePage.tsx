import { useAuth } from '../../modules/auth/AuthContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, UserCog, Utensils } from 'lucide-react';
import { getComandaById, abrirComanda } from '../../services/comanda.service';

export default function HomePage() {
  const { payload, logout } = useAuth();
  const [comanda, setComanda] = useState<number | ''>('');
  const [erro, setErro] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function validarNumero(): number | null {
    if (!comanda || Number.isNaN(Number(comanda))) return null;
    const id = Number(comanda);
    if (id <= 0) {
      setErro('Número de comanda inválido');
      setComanda('');
      return null;
    }
    setErro(null);
    return id;
  }

  async function executarAcao(acao: 'detalhes' | 'inserir') {
    const id = validarNumero();
    if (!id) return;

    setLoading(true);
    try {
      const comanda = await getComandaById(id);
      if(comanda.status === "FECHADA"){
        setErro("COMANDA FECHADA");
        return;
      }
      if(comanda.status === "CANCELADA"){
        setErro("COMANDA CANCELADA");
        return;
      }
      if (acao === 'detalhes') navigate(`/comanda/${id}/detalhes`);
      else navigate(`/comanda/${id}/itens`);
    } catch (err: any) {

      const status = err?.response?.status;
      if (status === 404) {
        const querAbrir = window.confirm(
          'A comanda informada não existe. Deseja abrir uma nova comanda agora?'
        );
        if (!querAbrir) return;

        if (!payload?.user) {
          setErro('É necessário estar autenticado para abrir comanda.');
          return;
        }
        const nova = await abrirComanda(Number(payload.sub));
        if (acao === 'detalhes') navigate(`/comanda/${nova.id}/detalhes`);
        else navigate(`/comanda/${nova.id}/itens`);
      } else {
        setErro(err?.message || 'Erro ao verificar comanda');
      }
    } finally {
      setLoading(false);
    }
  }

  const goInserir = () => executarAcao('inserir');
  const goDetalhes = () => executarAcao('detalhes');

  return (
    <div className="flex min-h-dvh">
      {/* conteúdo principal */}
      <div className="flex-1 bg-orange-50 p-6">
        <header className="mb-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">FoodManager</h1>
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <span className="font-mono">{payload?.user}</span>
            <button onClick={logout} className="rounded-full border border-gray-300 px-3 py-1 hover:bg-gray-100">
              Sair
            </button>
          </div>
        </header>

        <div className="mt-8 flex flex-col items-center gap-6">
          {/* input número da comanda */}
          <input
            type="number"
            placeholder="Número da comanda"
            value={comanda}
            onChange={(e) => setComanda(e.target.value ? Number(e.target.value) : '')}
            className="w-128 h-20 rounded-md border border-orange-400 bg-orange-100 px-4 py-2 text-center text-lg text-gray-800 placeholder-gray-500 outline-none focus:border-orange-600 focus:ring-1 focus:ring-orange-600"
          />

          {erro && <p className="mb-3 rounded-md bg-black/20 px-3 py-2 text-sm">{erro}</p>}
          <div className="flex gap-4">
            <button
              onClick={goDetalhes}
              disabled={loading}
              className="rounded-md bg-orange-500 px-6 py-3 text-white shadow hover:bg-orange-600 disabled:opacity-60"
            >
              {loading ? 'Verificando...' : 'Exibir detalhes'}
            </button>
            <button
              onClick={goInserir}
              disabled={loading}
              className="rounded-md bg-orange-500 px-6 py-3 text-white shadow hover:bg-orange-600 disabled:opacity-60"
            >
              {loading ? 'Verificando...' : 'Inserir produto'}
            </button>
          </div>
        </div>
      </div>

      {/* sidebar */}
      <aside className="flex w-36 flex-col items-center justify-between bg-orange-500 py-6 text-white">
        <div className="flex flex-col items-center gap-6">
          <button className="flex h-12 w-18 items-center justify-center rounded-md bg-yellow-300 text-black">
            <Menu />
          </button>
          <button className="flex h-12 w-18 items-center justify-center">
            <Utensils />
          </button>
        </div>
        <div>
          <button className="flex h-12 w-18 items-center justify-center">
            <UserCog />
          </button>
        </div>
      </aside>
    </div>
  );
}
