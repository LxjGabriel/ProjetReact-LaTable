export default function ButtonComponent({ label, onClick, severity = "primary", isloading = false }) {
    return (
        <div className="mb-3">
            <input
                type="submit"
                value={isloading ? "Loading..." : label}
                className={`btn btn-${severity}`}
                onClick={onClick}
                disabled={isloading}
            />
        </div>
    );
}