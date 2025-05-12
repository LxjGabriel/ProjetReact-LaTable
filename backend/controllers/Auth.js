const pool = require('../db');

class AuthController{
    
    async getAllUsers(req, res) {
        try {
            const result = await pool.query('SELECT * FROM users');
            res.json(result.rows);
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ error: "Erreur serveur" });
        }
    }
}

module.exports = new AuthController();

