function InputField({
    label,
    name,
    value,
    onChange,
    placeholder,
    step = "1",
    min,
    max,
    unit,
    hint,
}) {
    return (
        <div className="flex flex-col gap-2">

            <label
                htmlFor={name}
                className="text-sm font-medium text-slate-700"
            >
                {label}
            </label>

            <div className="relative">

                <input
                    id={name}
                    name={name}
                    type="number"
                    step={step}
                    min={min}
                    max={max}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={`w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-green-500 focus:ring-4 focus:ring-green-100 ${
                        unit ? "pr-14" : ""
                    }`}
                />

                {unit && (
                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                        {unit}
                    </span>
                )}

            </div>

            {hint && (
                <p className="text-xs leading-5 text-slate-400">
                    {hint}
                </p>
            )}

        </div>
    );
}

export default InputField;