export default function SelectComponent({ label, id, required = false, value, onChange, options = [] }) {
    return (
        <div className="mb-3">
            <label htmlFor={id} className="form-label">{label}</label>
            <select
                id={id}
                className="form-control"
                required={required}
                value={value}
                onChange={onChange}
            >
                <option value="" disabled>Sélectionner...</option>
                {options.map((option) =>
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                )}
            </select>
        </div>
    );
}