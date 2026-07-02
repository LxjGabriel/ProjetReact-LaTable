import { useState, useEffect } from "react";
import { MenuService } from "../../services/MenuService";
import InputComponent from "../../components/form/InputComponent";
import ButtonComponent from "../../components/form/ButtonComponent";
import SelectComponent from "../../components/form/SelectComponent";
import { useParams, useNavigate } from "react-router-dom";
import ToastService from "../../services/ToastService";

export default function MenuEdit() {
    const nav = useNavigate();
    const { id } = useParams();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const menu = await MenuService.GetMenuById(id);
                setFormData({
                    name: menu.name,
                    description: menu.description,
                    price: menu.price,
                    category: menu.category.toString()
                });
            } catch (error) {
                if (error.status === 404) {
                    ToastService.danger("Produit non trouvé.");
                    nav("/menu");
                }
            } finally {
                setLoading(false);
            }
        };
        fetchMenu();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await MenuService.UpdateMenu(id, formData);
            ToastService.success("Produit modifié avec succès.");
            nav("/menu");
        } catch (error) {
            ToastService.danger("Une erreur s'est produite. Veuillez réessayer.");
        }
    };

    if (loading) return <div className="container"><p className="loading-state">Chargement...</p></div>;

    return (
        <div className="container">
            <div className="page-header">
                <h1 className="page-title">Modifier le produit</h1>
            </div>
            <div className="form-page">
                <div className="form-section">
                    <form onSubmit={handleSubmit}>
                        <InputComponent label="Nom" id="name" required value={formData.name} onChange={handleChange} />
                        <InputComponent label="Description" id="description" required value={formData.description} onChange={handleChange} />
                        <InputComponent type="number" label="Prix (€)" id="price" required value={formData.price} onChange={handleChange} />
                        <SelectComponent
                            label="Catégorie"
                            id="category"
                            value={formData.category}
                            onChange={handleChange}
                            options={[
                                { value: "0", label: "Entrée" },
                                { value: "1", label: "Plat" },
                                { value: "2", label: "Dessert" },
                                { value: "3", label: "Boisson" }
                            ]}
                        />
                        <ButtonComponent label="Enregistrer les modifications" onClick={handleSubmit} />
                    </form>
                </div>
            </div>
        </div>
    );
}
