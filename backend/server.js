const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Route racine
app.get('/', (req, res) => {
    res.json({ message: "Bienvenue sur l'API resa" });
}); 


const routes = require('./routes');
app.use('/', routes);


app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});