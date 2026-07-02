import { useEffect, useState } from "react";
import MenuCardComponent from "../../components/menu/MenuCardComponent";
import { MenuService } from "../../services/MenuService";
import { AuthService } from "../../services/AuthService";
import { useNavigate } from "react-router-dom";
import ReservationButton from "../../components/ReservationButton";

export default function MenuHome() {
    const [entree, setEntree] = useState([]);
    const [plat, setPlat] = useState([]);
    const [dessert, setDessert] = useState([]);
    const [boisson, setBoisson] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const isAdmin = AuthService.IsConnected() && AuthService.GetUser().role === 1;

    useEffect(() => {
        const fetchMenus = async () => {
            try {
                const [e, p, d, b] = await Promise.all([
                    MenuService.GetAllMenuByCategory(0),
                    MenuService.GetAllMenuByCategory(1),
                    MenuService.GetAllMenuByCategory(2),
                    MenuService.GetAllMenuByCategory(3),
                ]);
                setEntree(e);
                setPlat(p);
                setDessert(d);
                setBoisson(b);
            } catch (err) {
                console.error("Erreur lors de la récupération des menus :", err);
            } finally {
                setLoading(false);
            }
        };
        fetchMenus();
    }, []);

    return (
        <div className="container">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Notre carte</h1>
                    <p className="page-subtitle">Découvrez nos plats préparés avec des produits frais de saison</p>
                </div>
                {isAdmin && (
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate("/menu/create")}
                    >
                        Ajouter un produit
                    </button>
                )}
            </div>

            {loading ? (
                <p className="loading-state">Chargement de la carte...</p>
            ) : (
                <>
                    <div className="menu-grid">
                        <MenuCardComponent title="Entrées" items={entree} />
                        <MenuCardComponent title="Plats" items={plat} />
                        <MenuCardComponent title="Desserts" items={dessert} />
                        <MenuCardComponent title="Boissons" items={boisson} />
                    </div>
                    <ReservationButton />
                </>
            )}
        </div>
    );
}
