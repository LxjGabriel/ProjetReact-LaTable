import { useState } from "react";
import { useEffect } from "react";
import { MenuService } from "../../services/MenuService";
import InputComponent from "../../components/form/InputComponent";
import ButtonComponent from "../../components/form/ButtonComponent";
import SelectComponent from "../../components/form/SelectComponent";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ToastService from "../../services/ToastService";


export default function MenuEdit() {

    const nav = useNavigate();

    const { id } = useParams();

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '', // 0: Entrée, 1: Plat, 2: Dessert, 3: Boisson
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
                        ToastService.danger("Menu non trouvé. Veuillez vérifier l'ID.");
                        nav("/menu");
                    }
                } finally {
                    setLoading(false);
                }
            };
            fetchMenu();
        }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
           MenuService.UpdateMenu(
                id,
                formData
            ).then(() => {
                ToastService.success("Menu modifié avec succès !");
                nav("/menu");
            }).catch((error) => {
                ToastService.danger("Une erreur s'est produite lors de la modification du menu. Veuillez réessayer plus tard.");
            }); 
        } catch (error) {
            alert(error.message || "Une erreur s'est produite lors de la connexion.");
        }
    }
    return (
        <div className="container">
            <h1>Modifier le menu</h1>
            <form>
                <InputComponent label="Nom" id="name" required value={formData.name} onChange={handleChange} />
                <InputComponent label="Description" id="description" required value={formData.description} onChange={handleChange} />
                <InputComponent type="number" label="Price" id="price" required value={formData.price} onChange={handleChange} />
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
                <ButtonComponent label="Modifier" onClick={handleSubmit} />
            </form>
        </div>
    )
}