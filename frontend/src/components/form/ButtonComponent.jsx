export default function ButtonComponent({ label, onClick }) {
    return (
        <div className="mb-3">
            <input
                type="submit"
                value={label}
                className="btn btn-primary"
                onClick={onClick}
            />
        </div>
    );
}