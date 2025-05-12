const pool = require('../db');

class MenuModel{
    constructor(name, description, price, category){
        this.name = name;
        this.description = description;
        this.price = price;
        this.category = category;
    }

    static async getAllMenus() {
        try {
            const result = await pool.query('SELECT * FROM menu_items');
            return result;
        } catch (err) {
            console.error(err.message);
            throw new Error("Erreur serveur");
        }
    }

    static async getAllMenusByCategory(category) {
        try {
            const result = await pool.query('SELECT * FROM menu_items WHERE category = $1', [category]);
            return result;
        } catch (err) {
            console.error(err.message);
            throw new Error("Erreur serveur");
        }
    }

    static async getMenuById(id) {
        try {
            const result = await pool.query('SELECT * FROM menu_items WHERE id = $1', [id]);
            return result;
        } catch (err) {
            console.error(err.message);
            throw new Error("Erreur serveur");
        }
    }

    async createMenu() {
        try {
            const result = await pool.query(
                'INSERT INTO menu_items (name, description, price, category) VALUES ($1, $2, $3, $4) RETURNING *',
                [this.name, this.description, this.price, this.category]
            );
            return result;
        } catch (err) {
            console.error(err.message);
            throw new Error("Erreur serveur");
        }
    }

    async updateMenu(id) {
        try {
            const result = await pool.query(
                'UPDATE menu_items SET name = $1, description = $2, price = $3, category = $4 WHERE id = $5 RETURNING *',
                [this.name, this.description, this.price, this.category, id]
            );
            return result;
        } catch (err) {
            console.error(err.message);
            throw new Error("Erreur serveur");
        }
    }
    
    static async deleteMenu(id) {
        try {
            await pool.query('DELETE FROM menu_items WHERE id = $1', [id]);
        } catch (err) {
            console.error(err.message);
            throw new Error("Erreur serveur");
        }
    }
}

module.exports = MenuModel;