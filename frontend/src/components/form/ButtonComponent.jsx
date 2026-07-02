export default function ButtonComponent({ label, onClick, severity = "primary", isloading = false }) {
    return (
        <div className="mb-3">
            <button
                type="button"
                className={`btn btn-${severity}`}
                onClick={onClick}
                disabled={isloading}
            >
                {isloading ? "Chargement..." : label}
            </button>
        </div>
    );
}
