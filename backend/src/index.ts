import express from "express";
import { prisma } from "./prisma";

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

app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});

