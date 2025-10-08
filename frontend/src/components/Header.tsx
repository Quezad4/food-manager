import { useAuth } from "../modules/auth/AuthContext";





export default function Header() {
    const { payload, logout } = useAuth();
    return (
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
        </div>
    );
}