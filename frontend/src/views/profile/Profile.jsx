import ButtonComponent from "../../components/form/ButtonComponent";
import localStorageHelper from "../../services/localStorageHelper";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import { AuthService } from "../../services/AuthService";


export default function Profile() {
    const [user, setUser] = useState({
        email: '',
        fname: '',
        lname: '',
        phone: ''
    });
    const navigate = useNavigate();

    const handleChangePassword = () => {
        navigate("/change-password");
    }

    const handleUpdateProfile = () => {
        navigate("/update-profile");
    }

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
                   ToastService.danger("Impossible de récupérer les données utilisateur. Veuillez réessayer plus tard.");
                   navigate("/profile");
                }
            };
            fetchMe();
        }, []);

    return (
        <div className="container">
            <h1>Votre Profile</h1>
            <p>Bienvenue {user.fname} {user.lname}</p>
            <p>Email: {user.email}</p>
            <p>Téléphone: {user.phone}</p>
            <ButtonComponent label={"Modifier votre profile"} onClick={handleUpdateProfile} />
            <ButtonComponent label={"Changer de mot de passe"} severity="warn" onClick={handleChangePassword} />
        </div>
    );
}