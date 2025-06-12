import { AuthService } from "../../services/AuthService";
import InputComponent from "../../components/form/InputComponent";
import ButtonComponent from "../../components/form/ButtonComponent";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ToastService from "../../services/ToastService";

export default function EditProfile() {
    const [formData, setFormData] = useState({
        email: '',
        prenom: '',
        nom: '',
        phone: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    useEffect(() => {
            const fetchMe = async () => {
                try {
                    const user = await AuthService.GetMe();
                    setFormData({
                        email: user.email,
                        prenom: user.fname,
                        nom: user.lname,
                        phone: '0' + user.phone
                    });
                } catch (error) {
                   console.error("Erreur lors de la récupération des données utilisateur :", error);
                   ToastService.danger("Impossible de récupérer les données utilisateur. Veuillez réessayer plus tard.");
                   navigate("/profile");
                } finally {
                    setLoading(false);
                }
            };
            fetchMe();
        }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await AuthService.UpdateProfile(
                formData.email,
                formData.prenom,
                formData.nom,
                formData.phone
            );
            ToastService.success("Profil mis à jour avec succès.");
            navigate("/profile");
        } catch (error) {
            if(error.status == 409) {
                setError("Un compte avec cet email existe déjà. Veuillez en utiliser un autre.");
            } else if (error.status == 400) {
                setError("Veuillez remplir tous les champs requis.");
            } else {
                setError("Une erreur s'est produite lors de la mise à jour du profil. Veuillez réessayer plus tard.");
            }
        }
    }

    return (
        <div className="container">
            <h1>Modification du profil</h1>
            <form>
                <InputComponent label="Email" type="email" id="email" required value={formData.email} onChange={handleChange} />
                <InputComponent label="Prénom" id="prenom" required value={formData.prenom} onChange={handleChange} />
                <InputComponent label="Nom" id="nom" required value={formData.nom} onChange={handleChange} />
                <InputComponent type="number" label="Téléphone" id="phone" required value={formData.phone} onChange={handleChange} />
                {error && <div className="alert alert-danger">{error}</div>}
                <ButtonComponent label="Modifier le profile" onClick={handleSubmit} />
            </form>
        </div>
    );
}