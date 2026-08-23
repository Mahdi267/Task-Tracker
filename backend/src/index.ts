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

app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});

