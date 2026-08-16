import express from "express";

const app = express();
const PORT = 3000;

// Middleware pour parser le JSON dans les requêtes
app.use(express.json());

// Route de test
app.get("/", (req, res) => {
    res.json({ message: "API Task Tracker en ligne !" });
});

app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});

