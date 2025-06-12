import { AuthService } from "../../services/AuthService";
import { MenuService } from "../../services/MenuService";
import MenuActionsPopover from "../MenuActionsPopover";
import { useNavigate } from "react-router-dom";
import ToastService from "../../services/ToastService";

export default function MenuCardComponent({ title, items = [] }) {

    const nav = useNavigate();

    const handleDelete = async (id) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cet élément ?")) {
            try {
                await MenuService.DeleteMenu(id);
                ToastService.success("Menu supprimé avec succès !");
                window.location.reload();
            } catch (error) {
                ToastService.danger("Une erreur s'est produite lors de la suppression du menu. Veuillez réessayer plus tard.");
            }
        }
    }

    const handleUpdate = (id) => {
        nav(`/menu/edit/${id}`);
    }

    return (
        <div className="card mb-3">
            <div className="card-header">
                <h2>{title}</h2>
            </div>
            <div className="card-body">
                {items.length > 0 ? (
                    <ul>
                        {items.map((item, index) => (
                            <li key={index} style={{display: 'flex', gap: '3em', justifyContent: 'center' , alignItems: 'center'}}>
                                <div>
                                    <p>{item.name}</p>
                                    <em>{item.description}</em>
                                    <h3>{item.price} €</h3>
                                </div>
                                {AuthService.IsConnected() && AuthService.GetUser().role === 1 && (
                                    <MenuActionsPopover
                                        onDelete={() => handleDelete(item.id)}
                                        onEdit={() => handleUpdate(item.id)}
                                    />
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Aucun élément disponible dans ce menu.</p>
                )}
            </div>
        </div>
    );
}