const MenuModel = require('../models/MenuModel');

class MenuController{
    
    async getAllMenus(req, res) {
        try {
            const result = await MenuModel.getAllMenus();
            res.json(result.rows);
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ error: "Erreur serveur" });
        }
    }

    async getMenuById(req, res) {
        const { id } = req.params;
        try {
            const result = await MenuModel.getMenuById(id);
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
            const menu = new MenuModel(name, description, price, category);
            const result = await menu.createMenu();
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
            const menu = await MenuModel.getMenuById(id);
            if (menu.rows.length === 0) {
                return res.status(404).json({ error: "Menu not found" });
            }
            const updatedMenu = new MenuModel(name, description, price, category);
            const result = await updatedMenu.updateMenu(id);
            res.status(200).json(result.rows[0]);
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ error: "Erreur serveur" });
        }
    }

    async deleteMenu(req, res) {
        const { id } = req.params;
        try {
            const menu = await MenuModel.getMenuById(id);
            if (menu.rows.length === 0) {
                return res.status(404).json({ error: "Menu not found" });
            }
            await MenuModel.deleteMenu(id);
            res.status(204).json();
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ error: "Erreur serveur" });
        }
    }
}

module.exports = new MenuController();

