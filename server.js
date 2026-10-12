const express = require("express");

const articleRoutes = require("./routes/articleRoutes");

const app = express();
const PORT = 3000;

// Middleware global
// Permet de lire les données JSON envoyées dans req.body
app.use(express.json());

// Montage du routeur sous le préfixe "/api/articles"
app.use("/api/articles", articleRoutes);
app.use("/api/users", require("./routes/userRoutes"));

// Route d'accueil pour tester le serveur
app.get("/", (req, res) => {
    res.json({
        message: "API du Blog - Serveur Modulaire Opérationnel (SoC)"
    });
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Serveur modulaire en écoute sur http://localhost:${PORT}`);
});