export default function ButtonComponent({ label, onClick, severity = "primary" }) {
    return (
        <div className="mb-3">
            <input
                type="submit"
                value={label}
                className={`btn btn-${severity}`}
                onClick={onClick}
            />
        </div>
    );
}