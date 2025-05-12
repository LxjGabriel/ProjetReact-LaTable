const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;

function authMiddleware(req, res, next) {
  // recupérer token depuis en tete bearer token
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  // si pas de token, refuser accès
  if (!token) {
    return res.sendStatus(401); // unauthorized
  }

  try {
    // vérifier et decoder le token
    const payload = jwt.verify(token, SECRET_KEY);
    // attacher les infos utilsiateur a req.user
    req.user = { id: payload.userId, email: payload.email };
    // passer authMiddleware ou la route suivante
    next();
  } catch (err) {
    // token invalide ou expiré
    res.sendStatus(401);
  }
}
module.exports = authMiddleware;
