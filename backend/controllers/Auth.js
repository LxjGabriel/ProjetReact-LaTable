const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Role = require('../models/Role');
const SECRET_KEY = process.env.SECRET_KEY;

class AuthController{

    async login(req, res) {
        const { email, password } = req.body;
            // validation basique
        if (typeof email !== 'string' || typeof password !== 'string') {
            return res.status(400).json({ error: 'Email et mot de passe requis.'});
        }

        try {
            // recupérer user
            const result = await pool.query(
                'SELECT id, hashed_password from users where email = $1', [email]
            );
            const rows = result.rows;
            
            if (rows.length === 0) {
                return res.status(401).json({ error: "Identifiants invalides..."});
            }
            
            // vérifer mdp
            const {id, hashed_password} = rows[0];
            const valid = await bcrypt.compare(password, hashed_password);
            if (!valid) {
                return res.status(401).json({error: 'Identifiants invalides. passwd'});
            }
        
            // générer jwt
            const token = jwt.sign({userId: id, email}, SECRET_KEY, {
                expiresIn: "1h"
            });
            
            //renvoyer le token
            res.json({ token });
        } catch (err) {
            res.status(500).json({ error: err.message})
        }
    }

    async signup(req, res) {
        const { email, password, fname, lname, phone, role } = req.body;
    
        // verification
        if (typeof email !== 'string' || email.trim() === '' || typeof password !== 'string' || password.length < 6) {
            return res.status(400).json({
                error: 'Email, Prenom, Nom, Telephone non vides requis, mot de passe d\'au moins 6 caractères.'
            })
        }

        try {
        // hacher le mot de passe
            const hash = await bcrypt.hash(password, 10);

            // Convertir le rôle de chaîne à entier
            let roleValue;
            if (role === 'USER') {
                roleValue = Role.USER; // 0
            } else if (role === 'ADMIN') {
                roleValue = Role.ADMIN; // 1
            } else {
                roleValue = Role.USER; // Valeur par défaut
            }
            
            // enregistrer l'utilisateur
            const result = await pool.query(
                'INSERT INTO users (email, hashed_password, fname, lname, phone, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id', [email, hash, fname, lname, phone, roleValue]
            );
            
            // renvoyer un succès
            res.status(201).json({id: result.rows[0].id, email});
        } catch (err) {
            // gérer err unicité
            if (err.code === '23505') {
                return res.status(409).json({ error: 'Email déjà utilisé'});
            }
            res.status(500).json({ error: err.message });
        }
    }
    
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

