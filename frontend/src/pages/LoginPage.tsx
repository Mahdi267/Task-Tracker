import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function LoginPage () {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError("");

        try {
            const reponse = await api.post("/login", { email, password });
            localStorage.setItem("token", reponse.data.token);
            navigate("/projects");
        } catch {
            setError("Email ou mot de passe incorrect.");
        }
    }

    return (
        <div className="p-8 max-w-sm mx-auto">
            <h1 className="text-2xl font-bold mb-4">Connexion</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                     type="email"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     className="w-full border rounded px-3 py-2"
                     required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Mot de passe</label>
                    <input
                     type="password"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     className="w-full border rounded px-3 py-2"
                     required 
                    />
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white rounded py-2 font-medium hover:bg-blue-700"
                >
                    Se connecter
                </button>
            </form>
        </div>
    );
}