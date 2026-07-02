import { AuthService } from "../../services/AuthService";
import { MenuService } from "../../services/MenuService";
import MenuActionsPopover from "../MenuActionsPopover";
import { useNavigate } from "react-router-dom";
import ToastService from "../../services/ToastService";

const CATEGORY_ICONS = {
    "Entrée": "⬡",
    "Entrées": "⬡",
    "Plats": "◈",
    "Desserts": "◇",
    "Boissons": "○",
};

export default function MenuCardComponent({ title, items = [] }) {
    const nav = useNavigate();
    const isAdmin = AuthService.IsConnected() && AuthService.GetUser().role === 1;

    const handleDelete = async (id) => {
        if (window.confirm("Supprimer cet élément de la carte ?")) {
            try {
                await MenuService.DeleteMenu(id);
                ToastService.success("Élément supprimé avec succès.");
                window.location.reload();
            } catch (error) {
                ToastService.danger("Une erreur s'est produite lors de la suppression.");
            }
        }
    };

    const handleUpdate = (id) => {
        nav(`/menu/edit/${id}`);
    };

    return (
        <div className="card">
            <div className="card-header">
                {title}
            </div>
            <div className="card-body">
                {items.length > 0 ? (
                    <ul className="menu-list">
                        {items.map((item) => (
                            <li key={item.id} className="menu-item">
                                <div className="menu-item-info">
                                    <span className="menu-item-name">{item.name}</span>
                                    {item.description && (
                                        <span className="menu-item-desc">{item.description}</span>
                                    )}
                                </div>
                                <div className="menu-item-right">
                                    <span className="menu-item-price">{item.price} €</span>
                                    {isAdmin && (
                                        <MenuActionsPopover
                                            onDelete={() => handleDelete(item.id)}
                                            onEdit={() => handleUpdate(item.id)}
                                        />
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="empty-state">Aucun élément disponible</p>
                )}
            </div>
        </div>
    );
}
