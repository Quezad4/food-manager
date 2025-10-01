import { LayoutList, Utensils, UserCog } from "lucide-react"

export default function HomePage() {
    return (
        <div className="flex min-h-dvh">
            <div className="flex-1 bg-orange-50 p-6">
                <div className="flex flex-col items-center gap-6">
                    <input
                        type="number"
                        placeholder="Número da comanda"
                        className="w-128 h-20 rounded-md border border-orange-400 bg-orange-100 px-4 py-2 text-center text-lg text-gray-800 placeholder-gray-500 focus:border-orange-600 focus:ring-1 focus:ring-orange-600 outline-none"
                    />

                    <div className="flex gap-4">
                        <button className="rounded-md bg-orange-500 px-6 py-3 text-white shadow hover:bg-orange-600">
                            Exibir detalhes
                        </button>
                        <button className="rounded-md bg-orange-500 px-6 py-3 text-white shadow hover:bg-orange-600">
                            Inserir produto
                        </button>
                    </div>
                </div>
            </div>

            {/* sidebar */}
            <aside className="flex w-36 flex-col items-center justify-between bg-orange-500 py-6 text-white">
                <div className="flex flex-col items-center gap-12">
                    <button className="w-18 h-12 flex items-center justify-center rounded-md bg-yellow-300 text-black">
                        <LayoutList />
                    </button>
                    <button className="w-18 h-12 flex items-center justify-center">
                        <Utensils />
                    </button>
                </div>
                <div>
                    <button className="w-18 h-12 flex items-center justify-center">
                        <UserCog />
                    </button>
                </div>
            </aside>
        </div>
    )
}
