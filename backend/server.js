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
    res.json({ message: "Bienvenue sur l'API resa" });
    // or res.send("Salut tout le monde");
});

app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  // Validation basique
  if (
    typeof username !== 'string' || username.trim() === '' ||
    typeof password !== 'string' || password.length < 6
  ) {
    return res.status(400).json({
      error: 'Username non vide requis, mot de passe d\'au moins 6 caractères.'
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