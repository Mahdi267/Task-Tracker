import { useEffect } from "react";
import api from "../api";

export default function ProjectsPage() {
    useEffect(() => {
        api.get("/projects").then((reponse) => {
            console.log(reponse.data);
        });
    }, []);

    return (
        <div className="p-8">
            <h1 className="text-2x1 font-bold">Mes projets</h1>
        </div>
    );
}