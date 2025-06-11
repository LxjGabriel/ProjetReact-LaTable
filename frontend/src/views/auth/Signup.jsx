import { AuthService } from "../../services/AuthService";
import InputComponent from "../../components/form/InputComponent";
import ButtonComponent from "../../components/form/ButtonComponent";
import { useState } from "react";

export default function Signup() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        prenom: '',
        nom: '',
        phone: ''
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
            await AuthService.Signup(
                formData.email,
                formData.password,
                formData.prenom,
                formData.nom,
                formData.phone,
                "USER"
            );
            window.location.href = "/login";
        } catch (error) {
            alert(error.message || "Une erreur s'est produite lors de l'inscription.");
        }
    }

    return (
        <div className="container">
            <h1>Inscription</h1>
            <form>
                <InputComponent label="Email" id="email" required value={formData.email} onChange={handleChange} />
                <InputComponent label="Mot de passe" type="password" id="password" required value={formData.password} onChange={handleChange} />
                <InputComponent label="Prénom" id="prenom" required value={formData.prenom} onChange={handleChange} />
                <InputComponent label="Nom" id="nom" required value={formData.nom} onChange={handleChange} />
                <InputComponent type="number" label="Téléphone" id="phone" required value={formData.phone} onChange={handleChange} />
                <ButtonComponent label="S'inscrire" onClick={handleSubmit} />
                <div className="mb-3">
                    <p>Déjà inscrit ? <a href="/login">Connectez-vous</a></p>
                </div>
            </form>
        </div>
    );
}