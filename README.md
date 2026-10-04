# MERN – Séance 1 : Mon premier serveur Express (l'API d'un blog)

## Compte rendu 1

**Étudiant :** Mohamed Houij
**Groupe :** Info DS 2


## Réponses aux questions

### Partie 2 – Prédisez : le `2` dans `/api/articles/2`, nombre ou texte ?

- **Ma prédiction :** je pensais que c'était un **nombre**, parce que dans l'URL on voit juste `2`.
- **Résultat observé (vérifié à l'étape 4) :** c'est du **texte**, `req.params.id` vaut `"2"`.
- **Explication :** une URL, c'est juste une chaîne de caractères. Express ne sait pas qu'on veut un nombre, donc tout ce qui vient de l'URL (`req.params` et `req.query`) arrive sous forme de texte. C'est pour ça qu'on doit faire `Number(req.params.id)`.

### Étape 4 – À vous : remplacer `Number(req.params.id)` par `req.params.id`

J'ai enlevé le `Number(...)`, j'ai enregistré puis j'ai ouvert `http://localhost:3000/api/articles/2`.

**Résultat :** le serveur répond **404** avec :

```json
{ "error": "Article 2 introuvable" }
```

alors que l'article 2 existe bien dans le tableau !

**Pourquoi ?** Dans le `find`, on compare `a.id === id`. Ici `a.id` vaut `2` (un nombre) et `id` vaut `"2"` (un texte). L'opérateur `===` compare la valeur **et** le type, donc `"2" === 2` est **faux**. Aucun article ne correspond, `find` renvoie `undefined` et on tombe dans le cas 404.

Je l'ai vérifié dans le terminal avec Node :

```
"2" === 2  ->  false
"2" == 2   ->  true    (== convertit le type, mais il vaut mieux l'éviter)
```

Ça confirme ce que j'ai découvert pour ma prédiction de la partie 2 : le `2` arrive bien en texte. Ensuite j'ai remis `Number(req.params.id)` et `/api/articles/2` affiche de nouveau l'article d'Aya.

### Étape 4 – Point de contrôle : pourquoi `return` devant `res.status(404)` ?

Une requête ne peut recevoir **qu'une seule réponse**. Sans le `return`, la fonction continue après le `res.status(404).json(...)` et arrive à `res.json(article)`. Express essaie alors de répondre une deuxième fois et on obtient l'erreur `Cannot set headers after they are sent`. Le `return` arrête la fonction juste après la réponse 404.

### Étape 5 – Prédisez : que vaut `total` ?

| URL                                    | Ma prédiction | Résultat observé |
|----------------------------------------|---------------|------------------|
| `/api/articles`                        | 3             | 3                |
| `/api/articles?author=Aya`             | 2             | 2 (après correction, voir plus bas) |
| `/api/articles?author=Omar`            | 0             | 0                |

**Remarque :** au premier essai, `?author=Aya` m'a donné **3** au lieu de 2, à cause d'une route en double (voir la partie « Difficulté rencontrée et solution »). Après correction, j'obtiens bien 2.

Pour `Omar`, on obtient `"total": 0` et `"articles": []` : `filter` renvoie un tableau vide (et pas `undefined` comme `find`).

### Étape 7 – Prédisez : les statuts dans Postman

| Méthode | URL                | Corps envoyé                                              | Statut prédit   | Statut obtenu   |
|---------|--------------------|-----------------------------------------------------------|-----------------|-----------------|
| GET     | `/api/articles`    | –                                                         | 200 OK          | 200 OK          |
| POST    | `/api/articles`    | `{ "title": "Mon premier article", "author": "Youssef" }` | 201 Created     | 201 Created     |
| GET     | `/api/articles/4`  | –                                                         | 200 OK          | 200 OK          |
| POST    | `/api/articles`    | `{ "title": "Sans auteur" }`                              | 400 Bad Request | 400 Bad Request |
| GET     | `/api/articles/99` | –                                                         | 404 Not Found   | 404 Not Found   |

Toutes mes prédictions étaient justes :

- **GET /api/articles → 200** : simple lecture, tout va bien.
- **POST avec titre + auteur → 201** : un nouvel article est créé avec l'`id` 4. La réponse est :
  `{ "message": "Article created", "article": { "id": 4, "title": "Mon premier article", "author": "Youssef" } }`
- **GET /api/articles/4 → 200** : l'article qu'on vient de créer existe bien.
- **POST sans auteur → 400** : la validation `if (!title || !author)` bloque la requête, c'est le client qui a envoyé des données incomplètes (famille 4xx).
- **GET /api/articles/99 → 404** : l'article n'existe pas.

### Étape 7 – Point de contrôle : redémarrage du serveur

Après le POST, `GET /api/articles` affiche `"total": 4`. Mais quand j'arrête le serveur et que je relance, le total revient à **3**. C'est normal : les articles sont seulement dans un tableau en mémoire (RAM), donc tout est perdu au redémarrage. C'est pour ça qu'on aura besoin d'une base de données.

---

## Difficulté rencontrée et solution

### Le problème

À l'étape 5, le filtre par auteur ne marchait pas. En ouvrant `http://localhost:3000/api/articles?author=Aya`, je recevais toujours les **3 articles** (`"total": 3`) au lieu des 2 articles d'Aya. Même chose avec `?author=Omar` : 3 articles au lieu de 0. Il n'y avait aucune erreur dans le terminal, le serveur répondait normalement, mais le filtre était ignoré.

### Comment j'ai cherché

1. J'ai d'abord relu le code du filtre (`filter(a => a.author === author)`) en le comparant avec l'énoncé : il était correct.
2. J'ai vérifié l'URL dans le navigateur (pas de faute dans `author`, majuscule à `Aya`) : c'était bon aussi.
3. En relisant tout le fichier `server.js`, je me suis rendu compte qu'il y avait **deux routes** `app.get('/api/articles', ...)` : l'ancienne de l'étape 3 et la nouvelle de l'étape 5. L'énoncé disait de **remplacer** la route, et moi je l'avais **ajoutée** en dessous.

### La cause

Express parcourt les routes **dans l'ordre où elles sont écrites** et utilise la première qui correspond à la méthode et à l'URL. Comme l'ancienne route (sans filtre) était au-dessus, c'était toujours elle qui répondait, et la nouvelle route n'était jamais exécutée.

### La solution

J'ai supprimé l'ancienne route pour ne garder que celle de l'étape 5 (qui gère les deux cas : avec et sans `?author=`). Après l'enregistrement, j'ai obtenu les bons résultats :

- `/api/articles` → `"total": 3`
- `/api/articles?author=Aya` → `"total": 2`
- `/api/articles?author=Omar` → `"total": 0`

### Ce que j'en retiens

L'ordre des routes est important dans Express, et quand l'énoncé dit « remplacez », il faut vraiment supprimer l'ancien code. Maintenant, quand une route ne réagit pas à mes modifications, je vérifie d'abord qu'il n'y a pas une autre route avec la même méthode et la même URL plus haut dans le fichier.

---

## Ce que j'ai retenu

- Le client envoie une **requête** (méthode + URL, et parfois un corps JSON) et le serveur renvoie une **réponse** (code de statut + JSON).
- Il y a trois façons de recevoir des infos du client : `req.params` (`/:id`), `req.query` (après le `?`) et `req.body` (corps JSON, grâce à `app.use(express.json())`).
- Tout ce qui vient de l'URL est du **texte** → il faut faire `Number(...)` avant de comparer avec un nombre.
- Il faut mettre `return` devant une réponse d'erreur pour ne pas répondre deux fois.
- `find` renvoie **un** élément (ou `undefined`), `filter` renvoie **un tableau** (éventuellement vide).
- Codes à retenir : **200** OK, **201** Created, **400** Bad Request, **404** Not Found.
=======
