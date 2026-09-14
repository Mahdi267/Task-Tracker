import { useNavigate } from "react-router-dom";

export default function Navdar() {
    const navigate = useNavigate();

    function handleLogout() {
        localStorage.removeItem("token");
        navigate("/login");
    }

    return (
        <nav className="bg-gray-800 text-white px-6 py-3 flex justify-between items-center">
            <span className="font-semibold">Task Tracker</span>
            <button onClick={handleLogout} className="text-sm hover:underline">
                Se déconnecter
            </button>
        </nav>
    );
}