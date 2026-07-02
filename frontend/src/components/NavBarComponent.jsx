import { Link } from "react-router-dom";
import { AuthService } from "../services/AuthService";

export default function NavBarComponent() {
  return (
    <nav>
      <Link to="/" className="nav-brand">
        La Table<span className="nav-brand-dot">.</span>
      </Link>

      <div className="nav-links">
        <Link to="/">Accueil</Link>
        <Link to="/menu">Menu</Link>

        {AuthService.IsConnected() ? (
          <>
            {AuthService.IsAdmin() ? (
              <Link to="/reservations">Réservations</Link>
            ) : (
              <Link to="/my-reservations">Mes réservations</Link>
            )}
            <Link to="/profile">Profil</Link>
            <Link to="/logout" className="nav-logout">Déconnexion</Link>
          </>
        ) : (
          <>
            <Link to="/login">Connexion</Link>
            <Link to="/signup" className="nav-signup">Inscription</Link>
          </>
        )}
      </div>
    </nav>
  );
}
