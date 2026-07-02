import ButtonComponent from "../../components/form/ButtonComponent";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { AuthService } from "../../services/AuthService";
import ToastService from "../../services/ToastService";

export default function Profile() {
    const [user, setUser] = useState({ email: '', fname: '', lname: '', phone: '' });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMe = async () => {
            try {
                const result = await AuthService.GetMe();
                setUser({
                    email: result.email,
                    fname: result.fname,
                    lname: result.lname,
                    phone: '0' + result.phone
                });
            } catch (error) {
                console.error("Erreur lors de la récupération des données utilisateur :", error);
                ToastService.danger("Impossible de récupérer les données utilisateur.");
                navigate("/profile");
            }
        };
        fetchMe();
    }, []);

    const initials = `${user.fname?.[0] || ''}${user.lname?.[0] || ''}`;

    return (
        <div className="container">
            <div className="page-header">
                <h1 className="page-title">Mon profil</h1>
            </div>

            <div className="profile-card">
                <div className="profile-avatar">{initials}</div>

                <div className="profile-info">
                    <h2 className="profile-name">{user.fname} {user.lname}</h2>

                    <div className="profile-fields">
                        <div className="profile-field">
                            <span className="profile-field-label">Email</span>
                            <span className="profile-field-value">{user.email}</span>
                        </div>
                        <div className="profile-field">
                            <span className="profile-field-label">Téléphone</span>
                            <span className="profile-field-value">{user.phone}</span>
                        </div>
                    </div>

                    <div className="profile-actions">
                        <ButtonComponent label="Modifier le profil" onClick={() => navigate("/update-profile")} />
                        <ButtonComponent label="Changer le mot de passe" severity="secondary" onClick={() => navigate("/change-password")} />
                    </div>
                </div>
            </div>
        </div>
    );
}
