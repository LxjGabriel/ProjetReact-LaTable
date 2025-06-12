import { AuthService } from "../../services/AuthService";
import InputComponent from "../../components/form/InputComponent";
import ButtonComponent from "../../components/form/ButtonComponent";
import { useState } from "react";

export default function Signup() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
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
            await AuthService.Login(
                formData.email,
                formData.password,
            );
            window.location.href = "/";
        } catch (error) {
            if(error.status === 401) {
                setError("Identifiants incorrects. Veuillez réessayer.");
            }
            else{
                setError("Une erreur s'est produite lors de la connexion. Veuillez réessayer plus tard.");
            }
        }
    }

    return (
        <div className="container">
            <h1>Connexion</h1>
            <form>
                <InputComponent label="Email" id="email" required value={formData.email} onChange={handleChange} />
                <InputComponent label="Mot de passe" type="password" id="password" required value={formData.password} onChange={handleChange} />
                {error && <div className="alert alert-danger">{error}</div>}
                <ButtonComponent label="Se Connecter" onClick={handleSubmit} />
                <div className="mb-3">
                    <p>Pas encore inscrit ? <a href="/signup">Inscrivez-vous</a></p>
                </div>
            </form>
        </div>
    );
}