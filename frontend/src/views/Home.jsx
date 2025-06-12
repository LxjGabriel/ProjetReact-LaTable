import ButtonComponent from "../components/form/ButtonComponent";
import { Link } from "react-router-dom";
import ReservationButton from "../components/ReservationButton";
import {AuthService} from "../services/AuthService";

export default function Home() {
    return (
        <div className="container">
            <div style={{textAlign: 'center', padding: '40px 20px'}}>
                <h1 style={{fontSize: '3rem', color: '#2c3e50', marginBottom: '20px'}}>
                    Bienvenue au Restaurant
                </h1>
                
                <p style={{fontSize: '1.2rem', color: '#7f8c8d', marginBottom: '30px', maxWidth: '600px', margin: '0 auto 30px'}}>
                    Découvrez une expérience culinaire exceptionnelle dans un cadre chaleureux et convivial. 
                    Notre chef vous propose une cuisine authentique préparée avec des produits frais et de saison.
                </p>
                
                <div style={{marginBottom: '40px'}}>
                    <Link to="/menu" style={{textDecoration: 'none'}}>
                        <ButtonComponent 
                            label="Découvrir le menu" 
                            severity="primary"
                        />
                    </Link>
                </div>
                {(!AuthService.IsAdmin()) && (
                    <div style={{
                        backgroundColor: '#f8f9fa', 
                        padding: '30px', 
                        borderRadius: '8px',
                        marginBottom: '30px'
                    }}>
                        <h3 style={{color: '#2c3e50', marginBottom: '15px'}}>
                            Réservez votre table
                        </h3>
                        <p style={{color: '#6c757d', marginBottom: '20px'}}>
                            Profitez d'un moment unique en réservant dès maintenant votre table
                        </p>
                        <ReservationButton />
                    </div>
                )}
            </div>
        </div>
    );
}