
const Role = require('./models/Role');

function requireRole(role = Role.USER) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.sendStatus(403); // Forbidden
    }
    next();
  };
}
module.exports = requireRole;