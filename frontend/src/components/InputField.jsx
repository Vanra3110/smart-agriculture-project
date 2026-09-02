function InputField({
    label,
    name,
    value,
    onChange,
    placeholder,
    step = "1",
}) {
    return (
        <div className="input-group">
            <label htmlFor={name}>
                {label}
            </label>

            <input
                id={name}
                name={name}
                type="number"
                step={step}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
            />
        </div>
    );
}

export default InputField;