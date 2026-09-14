const crops = [
    {
        name: "Rice",
        category: "Cereal",
        description:
            "A water-intensive cereal crop commonly grown in warm and humid conditions.",
        conditions: "High rainfall, high humidity, warm temperature",
    },
    {
        name: "Maize",
        category: "Cereal",
        description:
            "A versatile cereal crop that grows well in warm conditions with adequate rainfall.",
        conditions: "Moderate rainfall, warm temperature",
    },
    {
        name: "Chickpea",
        category: "Pulse",
        description:
            "A protein-rich pulse crop generally suited to relatively dry growing conditions.",
        conditions: "Moderate temperature, lower rainfall",
    },
    {
        name: "Kidney Beans",
        category: "Pulse",
        description:
            "A legume crop that requires suitable soil moisture and moderate environmental conditions.",
        conditions: "Moderate temperature, moderate rainfall",
    },
    {
        name: "Pigeon Peas",
        category: "Pulse",
        description:
            "A drought-tolerant pulse crop commonly cultivated in warm climates.",
        conditions: "Warm temperature, moderate rainfall",
    },
    {
        name: "Moth Beans",
        category: "Pulse",
        description:
            "A hardy legume that can tolerate relatively dry and warm conditions.",
        conditions: "Warm temperature, lower rainfall",
    },
    {
        name: "Mung Bean",
        category: "Pulse",
        description:
            "A fast-growing legume crop that performs well in warm conditions.",
        conditions: "Warm temperature, moderate rainfall",
    },
    {
        name: "Black Gram",
        category: "Pulse",
        description:
            "A legume crop commonly grown in warm climates with suitable soil moisture.",
        conditions: "Warm temperature, moderate rainfall",
    },
    {
        name: "Lentil",
        category: "Pulse",
        description:
            "A cool-season pulse crop that generally prefers moderate temperatures.",
        conditions: "Moderate temperature, moderate rainfall",
    },
    {
        name: "Pomegranate",
        category: "Fruit",
        description:
            "A fruit crop that can tolerate relatively dry conditions once established.",
        conditions: "Warm temperature, moderate rainfall",
    },
    {
        name: "Banana",
        category: "Fruit",
        description:
            "A tropical fruit crop requiring warmth, moisture, and relatively high humidity.",
        conditions: "Warm temperature, high humidity",
    },
    {
        name: "Mango",
        category: "Fruit",
        description:
            "A tropical fruit crop that prefers warm conditions and suitable seasonal rainfall.",
        conditions: "Warm temperature, moderate rainfall",
    },
    {
        name: "Grapes",
        category: "Fruit",
        description:
            "A fruit crop that generally benefits from suitable temperature and controlled moisture.",
        conditions: "Moderate temperature, moderate rainfall",
    },
    {
        name: "Watermelon",
        category: "Fruit",
        description:
            "A warm-season fruit crop that requires adequate moisture during growth.",
        conditions: "Warm temperature, moderate rainfall",
    },
    {
        name: "Muskmelon",
        category: "Fruit",
        description:
            "A warm-season crop that performs well with suitable temperature and moderate moisture.",
        conditions: "Warm temperature, moderate rainfall",
    },
    {
        name: "Apple",
        category: "Fruit",
        description:
            "A fruit crop generally associated with cooler growing conditions.",
        conditions: "Cooler temperature, suitable rainfall",
    },
    {
        name: "Orange",
        category: "Fruit",
        description:
            "A citrus fruit crop that grows well in warm conditions with adequate moisture.",
        conditions: "Warm temperature, moderate rainfall",
    },
    {
        name: "Papaya",
        category: "Fruit",
        description:
            "A tropical fruit crop requiring warm temperatures and adequate moisture.",
        conditions: "Warm temperature, moderate rainfall",
    },
    {
        name: "Coconut",
        category: "Fruit",
        description:
            "A tropical crop that generally prefers warm and humid conditions.",
        conditions: "High humidity, warm temperature, rainfall",
    },
    {
        name: "Cotton",
        category: "Commercial",
        description:
            "A major commercial crop requiring warm temperatures and suitable soil conditions.",
        conditions: "Warm temperature, moderate rainfall",
    },
    {
        name: "Jute",
        category: "Commercial",
        description:
            "A fiber crop that generally benefits from warm, humid, and wet conditions.",
        conditions: "High rainfall, high humidity, warm temperature",
    },
    {
        name: "Coffee",
        category: "Commercial",
        description:
            "A plantation crop that generally prefers warm conditions with adequate rainfall and humidity.",
        conditions: "High humidity, adequate rainfall",
    },
];

function Crops() {
    return (
        <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">

            {/* Header */}
            <section className="mx-auto max-w-5xl">

                <p className="text-sm font-bold tracking-widest text-green-600">
                    SUPPORTED CROPS
                </p>

                <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                    Crop Information
                </h1>

                <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
                    Explore the crops that our machine-learning model
                    can recommend based on soil and environmental
                    conditions.
                </p>

            </section>

            {/* Crop Cards */}
            <section className="mx-auto mt-10 max-w-5xl">

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

                    {crops.map((crop) => (
                        <article
                            key={crop.name}
                            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
                        >

                            {/* Icon + Category */}
                            <div className="flex items-start justify-between gap-3">

                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-2xl">
                                    🌱
                                </div>

                                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                                    {crop.category}
                                </span>

                            </div>

                            {/* Crop Name */}
                            <h2 className="mt-5 text-xl font-bold capitalize text-slate-900">
                                {crop.name}
                            </h2>

                            {/* Description */}
                            <p className="mt-3 text-sm leading-6 text-slate-600">
                                {crop.description}
                            </p>

                            {/* Conditions */}
                            <div className="mt-5 border-t border-slate-100 pt-4">

                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                    Suitable Conditions
                                </p>

                                <p className="mt-1 text-sm font-medium text-slate-700">
                                    {crop.conditions}
                                </p>

                            </div>

                        </article>
                    ))}

                </div>

            </section>

        </main>
    );
}

export default Crops;