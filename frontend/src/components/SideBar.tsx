import { Menu, Utensils, UserCog } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  // define as rotas dos ícones
  const isActive = (path: string) => location.pathname.startsWith(path)

  return (
    <aside className="flex w-36 flex-col items-center justify-between bg-orange-500 py-6 text-white">
      {/* topo */}
      <div className="flex flex-col items-center gap-6">
        {/* MENU - volta pra home */}
        <button
          onClick={() => navigate('/home')}
          className={`flex h-12 w-18 items-center justify-center rounded-md transition-colors ${
            isActive('/home') ? 'bg-yellow-300 text-black' : 'hover:bg-orange-600'
          }`}
          title="Comandas"
        >
          <Menu />
        </button>

        {/* PRODUTOS */}
        <button
          onClick={() => navigate('/produtos')}
          className={`flex h-12 w-18 items-center justify-center rounded-md transition-colors ${
            isActive('/produtos') ? 'bg-yellow-300 text-black' : 'hover:bg-orange-600'
          }`}
          title="Produtos"
        >
          <Utensils />
        </button>
      </div>

      {/* base */}
      <div>
        {/* CONFIGURAÇÕES */}
        <button
          onClick={() => navigate('/config')}
          className={`flex h-12 w-18 items-center justify-center rounded-md transition-colors ${
            isActive('/config') ? 'bg-yellow-300 text-black' : 'hover:bg-orange-600'
          }`}
          title="Configurações"
        >
          <UserCog />
        </button>
      </div>
    </aside>
  )
}
