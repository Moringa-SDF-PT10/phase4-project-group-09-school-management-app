import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import { LogOut, School } from "lucide-react";

export default function NavBar() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <header className="bg-white border-b">
            <div className="container py-3 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 front-semibold">
                <School className="w-5 h-5" />
                <span>Ustadi SMS</span>
                </Link>

                <nav className="flex items-center gap-4">
{user?.token ? (
    <>
        <Link to="/dashboard" className="text-sm hover:underline">Dashboard</Link>
        <button onClick={handleLogout} className="flex items-center gap-1 text-sm hover:underline">
            <LogOut className="w-4 h-4" />
            Logout
        </button>
    </>
) : (
    <Link to="/login" className="text-sm hover:underline">Login</Link>
)}
</nav>
</div>
</header>
)
}