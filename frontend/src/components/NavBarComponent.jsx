import { Link } from "react-router-dom";

export default function NavBarComponent() {
  return (
    <nav>
        <Link to="/">Accueil</Link> |{' '}
        <Link to="/login">Connexion</Link> |{' '}
        <Link to="/signup">Inscription</Link>
      </nav>
  );
}