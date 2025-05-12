const pool = require('../db');

class MenuController{
    
    async getAllMenus(req, res) {
        try {
            const result = await pool.query('SELECT * FROM menu_items');
            res.json(result.rows);
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ error: "Erreur serveur" });
        }
    }

    async getMenuById(req, res) {
        const { id } = req.params;
        try {
            const result = await pool.query('SELECT * FROM menu_items WHERE id = $1', [id]);
            if (result.rows.length === 0) {
                return res.status(404).json({ error: "Menu not found" });
            }
            res.json(result.rows[0]);
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ error: "Erreur serveur" });
        }
    }

    async createMenu(req, res) {
        const { name, description, price, category } = req.body;
        try {
            const result = await pool.query(
                'INSERT INTO menu_items (name, description, price, category) VALUES ($1, $2, $3, $4) RETURNING *',
                [name, description, price, category]
            );
            res.status(201).json(result.rows[0]);
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ error: "Erreur serveur" });
        }
    }

    async updateMenu(req, res) {
        const { id } = req.params;
        const { name, description, price, category } = req.body;
        try {
            const menu = await pool.query('SELECT * FROM menu_items WHERE id = $1', [id]);
            if (menu.rows.length === 0) {
                return res.status(404).json({ error: "Menu not found" });
            }
            const result = await pool.query(
                'UPDATE menu_items SET name = $1, description = $2, price = $3, category = $4 WHERE id = $5 RETURNING *',
                [name, description, price, category, id]
            );
            res.json(result.rows[0]);
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ error: "Erreur serveur" });
        }
    }

    async deleteMenu(req, res) {
        const { id } = req.params;
        try {
            const menu = await pool.query('SELECT * FROM menu_items WHERE id = $1', [id]);
            if (menu.rows.length === 0) {
                return res.status(404).json({ error: "Menu not found" });
            }
            await pool.query('DELETE FROM menu_items WHERE id = $1;', [id]);
            res.status(204).json();
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ error: "Erreur serveur" });
        }
    }
}

module.exports = new MenuController();

