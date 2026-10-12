const express = require("express");

const router = express.Router();

const articleController = require("../controllers/articleController");

// Le préfixe "/api/articles" sera défini dans server.js.
// Ici, "/" représente donc la racine de la ressource : "/api/articles"

// Récupérer tous les articles
router.get("/", articleController.getAllArticles);

// Récupérer un article par son ID
router.get("/:id", articleController.getArticleById);

// Créer un nouvel article
router.post("/", articleController.createArticle);

router.put("/:id", articleController.updateArticle);

router.delete("/:id", articleController.deleteArticle);

module.exports = router;