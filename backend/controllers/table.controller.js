const pool = require('../db'); 

class TableController {

    async getAllTables(req, res) {
        try {
            const result = await pool.query('SELECT * FROM tables');
            res.json(result.rows);
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ error: "Erreur serveur" });
        }
    }

    async createTable(req, res) {
        const { seats } = req.body;
        if (![2, 4, 6].includes(seats)) {
            return res.status(400).json({ error: "Nombre de sièges invalide" });
        }

        try {
            const result = await pool.query(
                'INSERT INTO tables (seats) VALUES ($1) RETURNING *',
                [seats]
            );
            res.status(201).json(result.rows[0]);
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ error: "Erreur serveur" });
        }
    }

    async updateTable(req, res) {
        const { id } = req.params;
        const { seats } = req.body;

        if (![2, 4, 6].includes(seats)) {
            return res.status(400).json({ error: "Nombre de sièges invalide" });
        }

        try {
            const existing = await pool.query('SELECT * FROM tables WHERE id = $1', [id]);
            if (existing.rows.length === 0) {
                return res.status(404).json({ error: "Table introuvable" });
            }

            const result = await pool.query(
                'UPDATE tables SET seats = $1 WHERE id = $2 RETURNING *',
                [seats, id]
            );
            res.status(200).json(result.rows[0]);
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ error: "Erreur serveur" });
        }
    }

    async deleteTable(req, res) {
        const { id } = req.params;

        try {
            const existing = await pool.query('SELECT * FROM tables WHERE id = $1', [id]);
            if (existing.rows.length === 0) {
                return res.status(404).json({ error: "Table introuvable" });
            }

            await pool.query('DELETE FROM tables WHERE id = $1', [id]);
            res.status(204).json();
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ error: "Erreur serveur" });
        }
    }
}

module.exports = new TableController();
