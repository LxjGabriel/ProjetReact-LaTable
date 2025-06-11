import ButtonComponent from "../form/ButtonComponent";
import { MenuService } from "../../services/MenuService";

export default function MenuCardComponent({ title, items = [] }) {

    const handleDelete = async (id) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cet élément ?")) {
            try {
                await MenuService.DeleteMenu(id);
                window.location.reload();
            } catch (error) {
                console.error("Erreur lors de la suppression du menu :", error);
                alert("Une erreur s'est produite lors de la suppression du menu. Veuillez réessayer plus tard.");
            }
        }
    }

    const handleUpdate = (id) => {
        window.location.href = `/menu/edit/${id}`;
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
                            <li key={index}>
                                <div>
                                    <p>{item.name}</p>
                                    <em>{item.description}</em>
                                </div>
                                <h3>{item.price} €</h3>
                                <ButtonComponent
                                    label="Supprimer"
                                    onClick={() => handleDelete(item.id)}
                                    severity="danger" />
                                <ButtonComponent
                                    label="Modifier"
                                    onClick={() => handleUpdate(item.id)}
                                    severity="warn" />
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