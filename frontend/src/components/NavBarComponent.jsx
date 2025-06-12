import { Link } from "react-router-dom";
import { useState } from "react";
import { AuthService } from "../services/AuthService";

export default function NavBarComponent() {
  return (
    <nav>
        <Link to="/">Accueil</Link>
        {' '}
        {AuthService.IsConnected() ? (
          <>
            <Link to="/my-reservations">Mes réservations</Link> {' '}
            <Link to="/profile">Mon Profil</Link> {' '}
            <Link to="/logout">Se déconnecter</Link> {' '}
          </> 
        ) : (
            <>
                <Link to="/login">Connexion</Link> {' '}
                <Link to="/signup">Inscription</Link> {' '}
            </>
        )}
    </nav>
  );
}