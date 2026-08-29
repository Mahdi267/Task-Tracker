import express from "express";
import { prisma } from "./prisma";
import { ProjectScalarFieldEnum } from "./generated/prisma/internal/prismaNamespace";

const app = express();
const PORT = 3000;

// Middleware pour parser le JSON dans les requêtes
app.use(express.json());

// Route de test
app.get("/", (req, res) => {
    res.json({ message: "API Task Tracker en ligne !" });
});

// Route de test : créer un utilisateur
app.post("/users", async (req, res) => {
    const { email, password, name } = req.body;

    try{
        const user = await prisma.user.create({
            data: { email, password, name },
        });

        res.status(201).json(user);
    } catch (error: any) {
        if (error.code == "P2002") {
            res.status(409).json({ error: "Cet email est déjà utilisé." });
        } else {
            console.error(error);
            res.status(500).json({ error: "Une erreur interne est survenue." });
        }
    }
});

// Lister tous les utilisateurs
app.get("/users", async (req, res) => {
    const users = await prisma.user.findMany();
    res.json(users);
});

// Récupérer un utilisateur précis
app.get("/users/:id", async (req, res) => {
    const id = Number(req.params.id);

    const user = await prisma.user.findUnique({ where: {id} });

    if (!user) {
        res.status(404).json({ error: "Utilisateur introuvable." });
        return;
    }

    res.json(user);
})

// Modifier un utilisateur
app.put("/users/:id", async (req, res) => {
    const id = Number(req.params.id);
    const { email, password, name } = req.body;

    try {
        const user = await prisma.user.update({
        where: {id},
        data: { email, password, name },
     });
     res.json(user);
    } catch (error: any) {
        if (error.code === "P2025") {
            res.status(404).json({ error: "Utilisateur introuvable." });
        } else if (error.code === "P2002") {
            res.status(409).json({ error: "Cet email est déjà utilisé." });
        } else {
            console.error(error);
            res.status(500).json({ error: "Une erreur interne est survenue." });
        }
    }
});

// Supprimer un utilisateur
app.delete("/users/:id", async (req, res) => {
    const id = Number(req.params.id);

    try {
        await prisma.user.delete({ where: {id} });
        res.status(204).send();
    } catch (error: any) {
        if (error.code === "P2025") {
            res.status(404).json({ error: "Utilisateur introuvable." });
        } else {
            console.error(error);
            res.status(500).json({ error: "Une erreur interne est survenue." });
        }
    }
});

// Créer un porjet
app.post("/projects", async (req, res) => {
    const { name, description, ownerId } = req.body;

    try {
        const project = await prisma.project.create({
            data: { name, description, ownerId },
        });
        res.status(201).json(project);
    } catch (error: any){
        if (error.code === "P2003") {
            res.status(400).json({ error: "L'utilisateur propriétaire (ownerId) n'existe pas." });
        } else {
            console.error(error);
            res.status(500).json({ error: "Une erreur interne est survenue." });
        }
    }
});

// Lister tous les projets (avec les infos du owner inclus)
app.get("/projects", async (req, res) => {
    const projects = await prisma.project.findMany({
        include: { owner: true },
    });
    res.json(projects);
});

// Récupérer un projet précis
app.get("/projects/:id", async (req, res) => {
    const id = Number(req.params.id);

    const projet = await prisma.project.findUnique({
        where: { id },
        include: { owner: true },
    });

    if (!projet) {
        res.status(404).json({ error: "Project introuvable." });
        return;
    }

    res.json(projet);
});

// Modifier un projet
app.put("/projects/:id", async (req, res) => {
    const id = Number(req.params.id);
    const {name, description, ownerId} = req.body;

    try{
        const project = await prisma.project.update({
            where: { id },
            data: { name, description, ownerId },
        });
        res.json(project);
    } catch (error: any) {
        if (error.code === "P2025") {
            res.status(404).json({ error: "Projet introuvable." });
        } else if (error.code === "P2003") {
            res.status(400).json({ error: "L'utilisateur propriétaire (ownerId) n'existe pas." });
        } else {
            console.error(error);
            res.status(500).json({ error: "Une erreur interne est survenue." });
        }
    }

});

// Supprimer nn projet
app.delete("/projects/:id", async (req, res) => {
    const id = Number(req.params.id);

    try {
        await prisma.project.delete({ where: { id } });
        res.status(204).send();
    } catch (error: any) {
        if (error.code === "P2025") {
            res.status(404).json({ error: "Projet introuvable." });
        } else {
            console.error(error);
            res.status(500).json({ error: "Une erreur interne est survenue." });
        }
    }
});

// Créer une tâche
app.post("/tasks", async (req, res) => {
    const { title, description, status, projectId, assigneeId } = req.body;

    try {
        const task = await prisma.task.create({
            data: { title, description, status, projectId, assigneeId },
        });
        res.status(203).json(task);
    } catch (error: any) {
        if (error.code === "P2003") {
            res.status(404).json({ error: "Le projet ou l'utilisateur assigné n'existe pas." });
        } else {
            console.error(error);
            res.status(500).json({ error: "Une erreur interne est survenue." });
        }
    }
});

// Lister toute les tâches (avec project et assignee inclus)
app.get("/tasks", async (req, res) => {
    const tasks = await prisma.task.findMany({
        include: { project: true, assignee: true },
    });
    res.json(tasks);
});

// Récupérer une tâche précise
app.get("/tasks/:id", async (req, res) => {
    const id = Number(req.params.id);

    const task = await prisma.task.findUnique({
        where: { id },
        include: { project: true, assignee: true },
    });

    if (!task) {
        res.status(404).json({ error: "Tâche introuvable." });
        return;
    }

    res.json(task);
});

// Modifier une tâche
app.put("/tasks/:id", async (req, res) => {
    const id = Number(req.params.id);
    const { title, description, status, projectId, assigneeId } = req.body;

    try {
        const task = await prisma.task.update({
            where: { id },
            data: { title, description, status, projectId, assigneeId },
        });
        res.json(task);
    } catch (error: any) {
        if (error.code === "P2025") {
            res.status(404).json({ error: "Tâche introuvable." });
        } else if (error.code === "P2003") {
            res.status(400).json({ error: "Le projet ou l'utilisateur assigné n'existe pas." });
        } else {
            console.error(error);
            res.status(500).json({ error: "Une erreur interne est survenue." });
        }
    }
});

// Supprimer une tâche
app.delete("/tasks/:id", async (req, res) => {
    const id = Number(req.params.id);

    try {
        await prisma.task.delete({ where: { id } });
        res.status(204).send();
    } catch (error: any) {
        if (error.code === "P2025") {
            res.status(404).json({ error: "Tâche introuvable." });
        } else {
            console.error(error);
            res.status(500).json({ error: "Une erreur interne est survenue." });
        }
    }
});

app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});

