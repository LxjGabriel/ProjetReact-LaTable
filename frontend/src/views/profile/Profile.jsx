import ButtonComponent from "../../components/form/ButtonComponent";
import localStorageHelper from "../../services/localStorageHelper";
import { useNavigate } from "react-router-dom";

export default function Profile() {
    const user = localStorageHelper.getData("user");
    const navigate = useNavigate();

    const handleChangePassword = () => {
        navigate("/change-password");
    }

    return (
        <div className="container">
            <h1>Votre Profile</h1>
            <p>Bienvenue {user.fname} {user.lname}</p>
            <ButtonComponent label={"Changer de mot de passe"} onClick={handleChangePassword} />
        </div>
    );
}