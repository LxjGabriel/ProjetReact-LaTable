const express = require('express');
const pool = require('./db');
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Route racine
app.get('/', (req, res) => {
    res.json({ message: "Bienvenue sur l'API Task Manager" });
    // or res.send("Salut tout le monde");
});

// Route pour lister les tâches
app.get('/api/tasks', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM tasks');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// Route pour créer une tâche
app.post('/api/tasks', async (req, res) => {
    try {
        const { title, description } = req.body;

        // → Validation du payload
        if (typeof title !== 'string' || title.trim() === '') {
          return res
          .status(400)
          .json({ error: 'Le champ "title" est obligatoire et doit être une chaîne non vide.' });
        }
        const result = await pool.query(
            'INSERT INTO tasks (title, description) VALUES ($1, $2) RETURNING *',
            [title, description]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

app.get('/api/tasks/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Tâche non trouvée' });
      }
  
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

app.put('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;

    const result = await pool.query(
      'UPDATE tasks SET title = $1, description = $2, status = $3 WHERE id = $4 RETURNING *',
      [title, description, status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tâche non trouvée' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tâche non trouvée' });
    }

    res.sendStatus(204); // Suppression réussie, pas de contenu à retourner
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  // Validation basique
  if (
    typeof username !== 'string' || username.trim() === '' ||
    typeof password !== 'string' || password.length < 6
  ) {
    return res.status(400).json({
      error: 'Username non vide requis, mot de passe d’au moins 6 caractères.'
    });
  }
  try {
    // 1. Hacher le mot de passe
    const hash = await bcrypt.hash(password, 10);
    // 2. Enregistrer l’utilisateur
    const [result] = await pool.query(
      'INSERT INTO users (username, password_hash) VALUES (?, ?)',
      [username, hash]
    );
    // 3. Renvoyer un succès
    res.status(201).json({ id: result.insertId, username });
  } catch (err) {
    // 4. Gérer l’erreur d’unicité
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Username déjà utilisé.' });
    }
    res.status(500).json({ error: err.message });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  // Validation basique
  if (typeof username !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'Username et mot de passe requis.' });
  }
  try {
    // 1. Récupérer l’utilisateur
    const [rows] = await pool.query(
      'SELECT id, password_hash FROM users WHERE username = ?',
      [username]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Identifiants invalides.' });
    }

    // 2. Vérifier le mot de passe
    const { id, password_hash } = rows[0];
    const valid = await bcrypt.compare(password, password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Identifiants invalides.' });
    }
    // 3. Générer un token JWT
    const token = jwt.sign({ userId: id, username }, SECRET_KEY, {
    expiresIn: '1h'
    });
    // 4. Renvoyer le token
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}); 




app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});