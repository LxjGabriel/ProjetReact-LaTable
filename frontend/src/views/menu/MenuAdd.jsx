import { useState } from "react";
import { MenuService } from "../../services/MenuService";
import InputComponent from "../../components/form/InputComponent";
import ButtonComponent from "../../components/form/ButtonComponent";
import SelectComponent from "../../components/form/SelectComponent";

export default function MenuAdd() {

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '', // 0: Entrée, 1: Plat, 2: Dessert, 3: Boisson
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
           MenuService.CreateMenu(
                formData
            ).then(() => {
                window.location.href = "/menu";
            }).catch((error) => {
                console.error("Erreur lors de la création du menu :", error);
                alert("Une erreur s'est produite lors de la création du menu. Veuillez réessayer plus tard.");
            }); 
        } catch (error) {
            alert(error.message || "Une erreur s'est produite lors de la connexion.");
        }
    }
    return (
        <div className="container">
            <h1>Créer un menu</h1>
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
                <ButtonComponent label="Créer" onClick={handleSubmit} />
            </form>
        </div>
    )
}