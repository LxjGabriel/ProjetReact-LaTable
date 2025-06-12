import ButtonComponent from "../../components/form/ButtonComponent";
import localStorageHelper from "../../services/localStorageHelper";
import { useNavigate } from "react-router-dom";

export default function Profile() {
    const user = localStorageHelper.getData("user");
    const navigate = useNavigate();

    const handleChangePassword = () => {
        navigate("/change-password");
    }

    const handleUpdateProfile = () => {
        navigate("/update-profile");
    }

    return (
        <div className="container">
            <h1>Votre Profile</h1>
            <p>Bienvenue {user.fname} {user.lname}</p>
            <p>Email: {user.email}</p>
            <p>Téléphone: 0{user.phone}</p>
            <ButtonComponent label={"Modifier votre profile"} onClick={handleUpdateProfile} />
            <ButtonComponent label={"Changer de mot de passe"} severity="warn" onClick={handleChangePassword} />
        </div>
    );
}