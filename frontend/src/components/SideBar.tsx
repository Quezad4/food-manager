import { Menu, Utensils, UserCog, ListOrdered } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../modules/auth/AuthContext'

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const {payload} = useAuth()

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
        {payload?.isAdmin &&
        <button
          onClick={() => navigate('/produtos')}
          className={`flex h-12 w-18 items-center justify-center rounded-md transition-colors ${
            isActive('/produtos') ? 'bg-yellow-300 text-black' : 'hover:bg-orange-600'
          }`}
          title="Produtos"
        >
          <Utensils />
        </button>
        }

        <button
          onClick={() => navigate('/comandas')}
          className={`flex h-12 w-18 items-center justify-center rounded-md transition-colors ${
            isActive('/comandas') ? 'bg-yellow-300 text-black' : 'hover:bg-orange-600'
          }`}
          title="Comandas"
        >
          <ListOrdered />
        </button>
      </div>

      {/* base */}
      <div>
        {payload?.isAdmin &&
        <button
          onClick={() => navigate('/funcionarios')}
          className={`flex h-12 w-18 items-center justify-center rounded-md transition-colors ${
            isActive('/funcionarios') ? 'bg-yellow-300 text-black' : 'hover:bg-orange-600'
          }`}
          title="Configurações"
        >
          <UserCog />
        </button>
        }
        
      </div>
    </aside>
  )
}
