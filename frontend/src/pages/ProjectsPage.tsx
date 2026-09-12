import { useEffect, useState } from "react";
import api from "../api";

interface Project {
    id: number;
    name: string;
    description: string | null;
    createdAt: string;
    owner: {
        id: number;
        name: string;
    };
}

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        api.get("/projects").then((reponse) => {
            setProjects(reponse.data);
        });
    }, []);

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold">Mes projets</h1>
            <div className="space-y-3">
                {projects.map((project) => (
                    <div key={project.id} className="border rounded-lg p-4 shadow-sm">
                        <h2 className="text-lg font-semibold">{project.name}</h2>
                        <p className="text-gray-600">{project.description}</p>
                        <p className="text-sm text-gray-400">Par {project.owner.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}