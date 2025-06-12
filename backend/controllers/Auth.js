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
                'SELECT id, hashed_password, role from users where email = $1', [email]
            );
            const rows = result.rows;
            
            if (rows.length === 0) {
                return res.status(401).json({ error: "Identifiants invalides..."});
            }
            
            // vérifer mdp
            const {id, hashed_password, role} = rows[0];
            const valid = await bcrypt.compare(password, hashed_password);
            if (!valid) {
                return res.status(401).json({error: 'Identifiants invalides. passwd'});
            }
        
            // générer jwt
            const token = jwt.sign({userId: id, email, role}, SECRET_KEY, {
                expiresIn: "1h"
            });
            
            //renvoyer le token
            res.json({ token, user: { id, email, role } });
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

    async getMe(req, res) {
        try {
            const userId = req.user.id;
            if (!userId) {
                return res.status(401).json({ error: "Utilisateur non authentifié" });
            }

            const result = await pool.query(
                'SELECT id, email, fname, lname, phone, role FROM users WHERE id = $1', [userId]
            );
            
            res.status(200).json(result.rows[0]);
        } catch (error) {
            res.status(500).json({ error: "Erreur serveur" });
        }
    }

    async changePassword(req, res) {
        try {
            const { currentPassword, newPassword, confirmNewPassword } = req.body;
            const user = req.user;

            // Vérifier si l'utilisateur est authentifié
            if (!user) {
                return res.status(401).json({ error: "Utilisateur non authentifié" });
            }

            // Vérifier si le mot de passe actuel est correct
            const result = await pool.query(
                'SELECT hashed_password from users where id = $1', [user.id]
            );
            const valid = await bcrypt.compare(currentPassword, result.rows[0].hashed_password);
            if (!valid) {
                return res.status(401).json({ error: "Mot de passe actuel incorrect" });
            }

            // Vérifier si le nouveau mot de passe et la confirmation correspondent
            if (newPassword !== confirmNewPassword) {
                return res.status(400).json({ error: "Les nouveaux mots de passe ne correspondent pas" });
            }

            // Hacher le nouveau mot de passe
            const hash = await bcrypt.hash(newPassword, 10);

            // Mettre à jour le mot de passe dans la base de données
            await pool.query(
                'UPDATE users SET hashed_password = $1 WHERE id = $2',
                [hash, user.id]
            );

            res.status(200).json({ message: "Mot de passe changé avec succès" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Erreur serveur" });
        }
    }

    async updateProfile(req, res) {
        const { email, fname, lname, phone } = req.body;
        const userId = req.user.id;

        // Validation basique
        if (typeof email !== 'string' || typeof fname !== 'string' || typeof lname !== 'string' || typeof phone !== 'string') {
            return res.status(400).json({ error: 'Tous les champs sont requis.' });
        }

        try {
            // Mettre à jour l'utilisateur
            const result = await pool.query(
                'UPDATE users SET email = $1, fname = $2, lname = $3, phone = $4 WHERE id = $5 RETURNING id',
                [email, fname, lname, phone, userId]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Utilisateur non trouvé.' });
            }

            res.status(200).json({ message: 'Profil mis à jour avec succès.' });
        } catch (err) {
            if (err.code === '23505') { // Erreur d'unicité
                return res.status(409).json({ error: 'Email déjà utilisé.' });
            }
            res.status(500).json({ error: err.message });
        }
    }
}

module.exports = new AuthController();

