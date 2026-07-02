import { Link } from "react-router-dom";
import ReservationButton from "../components/ReservationButton";
import { AuthService } from "../services/AuthService";

export default function Home() {
    return (
        <div className="home-page">
            <section className="hero-section">
                <div className="hero-content">
                    <span className="hero-badge">Réservation en ligne disponible</span>
                    <h1 className="hero-title">
                        Une expérience culinaire d'exception
                    </h1>
                    <p className="hero-subtitle">
                        Découvrez une cuisine raffinée, préparée avec passion et des produits frais de saison.
                        Notre chef vous invite à un voyage gastronomique inoubliable.
                    </p>
                    <div className="hero-actions">
                        <Link to="/menu" className="btn btn-primary btn-lg">
                            Découvrir la carte
                        </Link>
                    </div>
                </div>
            </section>

            {!AuthService.IsAdmin() && (
                <section className="cta-section">
                    <div className="cta-content">
                        <h2 className="cta-title">Réservez votre table</h2>
                        <p className="cta-text">
                            Profitez d'un moment unique dans un cadre chaleureux.
                            Réservez dès maintenant et garantissez votre place.
                        </p>
                        <ReservationButton />
                    </div>
                </section>
            )}
        </div>
    );
}
