const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;
const TableController = require('./controllers/table.controller');

app.use(cors({
  origin: 'http://localhost:3001'
}));
app.use(express.json());

// Route racine
app.get('/', (req, res) => {
    res.json({ message: "Bienvenue sur l'API resa" });
}); 
// Endpoints manuales
app.get('/tables', TableController.getAllTables);
app.post('/tables', TableController.createTable);
app.put('/tables/:id', TableController.updateTable);
app.delete('/tables/:id', TableController.deleteTable);


const routes = require('./routes');
app.use('/', routes);


app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});