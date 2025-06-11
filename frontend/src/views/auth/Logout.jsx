import { AuthService } from "../../services/AuthService";

export default function Logout() {

    AuthService.Logout();
    window.location.href = "/login";

  return (
    <div className="container">
      <p>Déconnexion en cours...</p>
    </div>
  );
}