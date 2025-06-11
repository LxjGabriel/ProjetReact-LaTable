export default function MenuCardComponent({ title, items }) {
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