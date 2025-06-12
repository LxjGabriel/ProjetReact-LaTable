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
    const [error, setError] = useState(null);

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
            if(error.status == 409) {
                setError("Un compte avec cet email existe déjà. Veuillez en utiliser un autre.");
            } else if (error.status == 400) {
                setError("Veuillez remplir tous les champs requis.");
            } else {
                setError("Une erreur s'est produite lors de l'inscription. Veuillez réessayer plus tard.");
            }
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
                {error && <div className="alert alert-danger">{error}</div>}
                <ButtonComponent label="S'inscrire" onClick={handleSubmit} />
                <div className="mb-3">
                    <p>Déjà inscrit ? <a href="/login">Connectez-vous</a></p>
                </div>
            </form>
        </div>
    );
}