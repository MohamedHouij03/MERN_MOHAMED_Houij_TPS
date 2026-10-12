const express = require("express");

const router = express.Router();

const userController = require("../controllers/userController");

// Le préfixe "/api/users" sera défini dans server.js.
// Ici, "/" représente donc la racine de la ressource : "/api/users"

// Récupérer tous les users
router.get("/", userController.getAllUsers);

// Récupérer un user par son ID
router.get("/:id", userController.getUserById);

// Créer un nouveau user
router.post("/", userController.createUser);

router.delete("/:id", userController.deleteUser);

module.exports = router;