
const { estNonVide, estEmailValide } = require("../utils/validators");

const getAllUsers = (req, res) => {
    const { role } = req.query;

    let resultat = users;

    if (role) {
        resultat = users.filter(a => a.role === role );
    }

    res.status(200).json({
        total: resultat.length,
        users: resultat
    });
};

const getUserById = (req, res) => {
    const id = Number(req.params.id);

    const user = users.find(u => u.id === id);

    if (!user) {
        return res.status(404).json({
            error: `User ${id} introuvable`
        });
    }

    res.status(200).json(user);
};
const createUser = (req, res) => {
    const { name, email, role } = req.body;

    if (!name || !email || !role) {
        return res.status(400).json({
            error: "Le nom, l'email et le rôle sont obligatoires"
        });
    }
    if (!estNonVide(name)) {
        return res.status(400).json({
            error: "Le nom ne peut pas être vide"
        });
    }
    if (!estEmailValide(email)) {
        return res.status(400).json({
            error: "L'email n'est pas valide"
        });
    }   
    
    const nouvelUser = {
        id: prochainId++,
        name,
        email,
        role
    };

    users.push(nouvelUser);

    res.status(201).json({
        message: "User créé",
        user: nouvelUser
    });
};

const deleteUser = (req, res) => {
    const id = Number(req.params.id);

    const userExiste = users.some(u => u.id === id);

    if (!userExiste) {
        return res.status(404).json({
            error: `Impossible de supprimer : user ${id} introuvable`
        });
    }

    // On garde uniquement les users ayant un ID différent
    users = users.filter(u => u.id !== id);

    res.status(200).json({
        message: `User ${id} supprimé avec succès`
    });
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    deleteUser,
};