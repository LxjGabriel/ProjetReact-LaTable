import { AuthService } from "../../services/AuthService";
import InputComponent from "../../components/form/InputComponent";
import ButtonComponent from "../../components/form/ButtonComponent";
import { useState } from "react";
import ToastService from "../../services/ToastService";
import { useNavigate } from "react-router-dom";

export default function ChangePassword() {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await AuthService.ChangePassword(
                formData.currentPassword,
                formData.newPassword,
                formData.confirmNewPassword
            );
            ToastService.success("Mot de passe changé avec succès.");
            navigate("/profile");
        } catch (error) {
            if(error.status === 401) {
                setError("Mot de passe actuel incorrect. Veuillez réessayer.");
            } else if (error.status === 400) {
                setError("Les nouveaux mots de passe ne correspondent pas.");
            } else {
                setError("Une erreur est survenue. Veuillez réessayer.");
            }
        }
    }

    return (
        <div className="container">
            <h1>Changement de mot de passe</h1>
            <form>
                <InputComponent label="Mot de passe actuel" id="currentPassword" type="password" required value={formData.currentPassword} onChange={handleChange} />
                <InputComponent label="Nouveau mot de passe" id="newPassword" type="password" required value={formData.newPassword} onChange={handleChange} />
                <InputComponent label="Confirmer le nouveau mot de passe" id="confirmNewPassword" type="password" required value={formData.confirmNewPassword} onChange={handleChange} />
                {error && <div className="alert alert-danger">{error}</div>}
                <ButtonComponent label="Changer le mot de passe" onClick={handleSubmit} />
            </form>
        </div>
    );
}