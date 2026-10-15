function InputField({
    label,
    name,
    type,
    value,
    onChange,
    placeholder,
    step = "1",
    min,
    max,
    unit,
    hint,
    error,
}) {
    const isRange = type === "range";

    return (
        <div className="flex flex-col gap-2">

            <label
                htmlFor={name}
                className={`text-sm font-medium ${error ? "text-red-600" : "text-slate-700"}`}
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
                    className={`w-full rounded-xl border bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 ${
                        error
                            ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                            : "border-slate-200 focus:border-green-500 focus:ring-green-100"
                    } ${unit ? "pr-14" : ""}`}
                />

                {unit && (
                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                        {unit}
                    </span>
                )}

            </div>

            {isRange && (
                <div className="mt-2 px-1">
                    <input
                        type="range"
                        name={name}
                        step={step}
                        min={min || "0"}
                        max={max || "100"}
                        value={value === "" ? min || "0" : value}
                        onChange={onChange}
                        className={`w-full h-2 appearance-none rounded-lg bg-slate-200 outline-none transition-all cursor-pointer ${
                            error ? "accent-red-600 focus:ring-2 focus:ring-red-500/30" : "accent-green-600 focus:ring-2 focus:ring-green-500/30"
                        }`}
                    />
                    <div className="mt-1 flex justify-between text-[10px] font-medium text-slate-400">
                        <span>{min || "0"}</span>
                        <span>{max || "100"}</span>
                    </div>
                </div>
            )}

            {error ? (
                <p className="text-xs leading-5 text-red-500">
                    {error}
                </p>
            ) : hint ? (
                <p className="text-xs leading-5 text-slate-400">
                    {hint}
                </p>
            ) : null}

        </div>
    );
}

export default InputField;