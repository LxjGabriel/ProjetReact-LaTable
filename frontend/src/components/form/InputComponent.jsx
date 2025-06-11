export default function InputComponent({ label, type = "text", id, required = false, value, onChange }) {
    return (
        <div className="mb-3">
            <label htmlFor={id} className="form-label">{label}</label>
            <input
                type={type}
                className="form-control"
                id={id}
                required={required}
                value={value}
                onChange={onChange}
            />
        </div>
    );
}