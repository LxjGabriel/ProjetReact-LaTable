import React, { useEffect, useState } from "react";
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

    useEffect(() => {
        const fetchMenus = async () => {
            try {
                const entree = await MenuService.GetAllMenuByCategory(0);
                const plat = await MenuService.GetAllMenuByCategory(1);
                const dessert = await MenuService.GetAllMenuByCategory(2);
                const boisson = await MenuService.GetAllMenuByCategory(3);
                setEntree(entree);
                setPlat(plat);
                setDessert(dessert);
                setBoisson(boisson);
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
            <h1>Tous nos menus</h1>
            {loading ? (
                <div className="mb-3">Chargement...</div>
            ) : (
                <>
                    { AuthService.IsConnected() && AuthService.GetUser().role === 1 && (
                        <div className="mb-3">
                            <button onClick={() => navigate("/menu/create")} className="btn btn-primary">Ajouter un produit à la carte</button>
                        </div>
                    )}
                    <div className="flex">
                        <div className="col-md-4">
                            <MenuCardComponent title="Entrée" items={entree} />
                        </div>
                        <div className="col-md-4">
                            <MenuCardComponent title="Plats" items={plat} />
                        </div>
                        <div className="col-md-4">
                            <MenuCardComponent title="Desserts" items={dessert} />
                        </div>
                        <div className="col-md-4">
                            <MenuCardComponent title="Boissons" items={boisson} />
                        </div>
                    </div>
                </>
            )}
            <ReservationButton />
        </div>
    );
}