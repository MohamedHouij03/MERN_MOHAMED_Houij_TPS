const express = require('express'); 
const app = express(); 
const PORT = 3000;
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Hello, I am the blog API' });
});
const articles = [
  { id: 1, title: 'Bienvenue sur le blog', author: 'Admin' },
  { id: 2, title: 'Mon premier serveur Express', author: 'Aya' },
  { id: 3, title: 'Tester une API avec Postman', author: 'Aya' }
];

// GET /api/articles/2 -> l'article dont l'id vaut 2
app.get('/api/articles/:id', (req, res) => {
  const id = Number(req.params.id);          // "2" -> 2
  const article = articles.find(a => a.id === id);

  if (!article) {
    return res.status(404).json({ error: `Article ${id} introuvable` });
  }
  res.json(article);
});
// GET /api/articles            -> tous les articles
// GET /api/articles?author=Aya -> seulement ceux d'Aya
app.get('/api/articles', (req, res) => {
  const { author } = req.query;   // = const author = req.query.author;

  let resultat = articles;
  if (author) {                   // si le client a précisé ?author=...
    resultat = articles.filter(a => a.author === author);
  }
  res.json({ total: resultat.length, articles: resultat });
});
let nextId = 4; // Next auto-incremented ID (IDs 1, 2, and 3 are already assigned)

// POST /api/articles -> Creates an article from { "title": "...", "author": "..." }
app.post('/api/articles', (req, res) => {
    const { title, author } = req.body; // Destructuring

    // Validation: both fields are required
    if (!title || !author) {
        return res.status(400).json({
            error: "Title and author are required"
        });
    }

    const newArticle = {
        id: nextId,
        title: title,
        author: author
    };

    nextId = nextId + 1;
    articles.push(newArticle);

    res.status(201).json({
        message: 'Article created',
        article: newArticle
    });
});
// 4. bind and listen: await incoming HTTP requests on port 3000
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

