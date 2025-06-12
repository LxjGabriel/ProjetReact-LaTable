import { Link } from "react-router-dom";
import { useState } from "react";
import { AuthService } from "../services/AuthService";

export default function NavBarComponent() {
  return (
    <nav>
        <Link to="/">Accueil</Link>
        <Link to="/menu">Menu</Link> {' '}
        {' '}
        {AuthService.IsConnected() ? (
          <>
            {AuthService.IsAdmin() ? (
              <Link to="/reservations">Réservations</Link>
            ) : (
              <Link to="/my-reservations">Mes réservations</Link>
            )}
            {' '}
            <Link to="/profile">Mon Profil</Link> {' '}
            <Link to="/logout"><span style={{ color: "red" }}>Se déconnecter</span></Link> {' '}
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