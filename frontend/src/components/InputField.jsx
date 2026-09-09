function InputField({
    label,
    name,
    value,
    onChange,
    placeholder,
    step = "1",
}) {
    return (
        <div className="flex flex-col gap-2">
            <label htmlFor={name} className="text-sm font-medium text-slate-700">
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
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400
                outline-none
                transition
                focus:border-green-500
                focus:ring-4
                focus:ring-green-100
                "
            />
        </div>
    );
}

export default InputField;