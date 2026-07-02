import { Link } from "react-router-dom";
import { AuthService } from "../services/AuthService";

export default function ReservationButton({
    text = "Réserver une table"
}) {
    if (!AuthService.IsConnected()) {
        return (
            <div className="res-btn-wrapper">
                <Link to="/login" className="btn btn-primary">
                    {text}
                </Link>
                <p className="res-login-note">Connectez-vous pour effectuer une réservation.</p>
            </div>
        );
    }

    if (AuthService.IsAdmin()) {
        return null;
    }

    return (
        <div className="res-btn-wrapper">
            <Link to="/reservations/new" className="btn btn-primary">
                {text}
            </Link>
        </div>
    );
}
