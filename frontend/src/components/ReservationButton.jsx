import React from "react";
import { Link } from "react-router-dom";
import { AuthService } from "../services/AuthService";

export default function ReservationButton({ 
    className = "btn btn-success", 
    text = "Faire une réservation",
    showOnlyForClients = false 
}) {
    
    // Vérifier si l'utilisateur est connecté
    if (!AuthService.IsConnected()) {
        return null;
    }

    // Si on veut afficher seulement pour les clients (non-admins)
    if (showOnlyForClients && AuthService.GetUser().role === 1) {
        return null;
    }

    return (
        <div className="mb-3">
            <Link to="/reservations/new" className={className}>
                {text}
            </Link>
        </div>
    );
}