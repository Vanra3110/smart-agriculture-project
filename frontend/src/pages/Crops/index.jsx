import { motion } from "motion/react";
import { Link } from "react-router-dom";

export const crops = [
    {
        name: "Rice",
        category: "Cereal",
        description: "A water-intensive cereal crop commonly grown in warm and humid conditions.",
        conditions: "High rainfall, high humidity, warm temperature",
        image: "src/assets/crop_img/rice.jpg",
        detailedDescription: "Rice is the seed of the grass species Oryza sativa (Asian rice) or, much less commonly, Oryza glaberrima (African rice). As a cereal grain, it is the most widely consumed staple food for a large part of the world's human population.",
        growingSeason: "Kharif (June to October) in India, requires flooded fields for best yield.",
        harvestTime: "Winter (November to December)"
    },
    {
        name: "Maize",
        category: "Cereal",
        description: "A versatile cereal crop that grows well in warm conditions with adequate rainfall.",
        conditions: "Moderate rainfall, warm temperature",
        image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=800&q=80",
        detailedDescription: "Maize, also known as corn, is a cereal grain first domesticated by indigenous peoples in southern Mexico about 10,000 years ago. It has become a staple food in many parts of the world, with total production surpassing that of wheat or rice.",
        growingSeason: "Spring/Early Summer (requires temperatures above 50°F / 10°C)",
        harvestTime: "Late Summer to Autumn (depending on variety)"
    },
    {
        name: "Chickpea",
        category: "Pulse",
        description: "A protein-rich pulse crop generally suited to relatively dry growing conditions.",
        conditions: "Moderate temperature, lower rainfall",
        image: "https://images.unsplash.com/photo-1582294468698-c1fa9fb617e4?w=800&q=80",
        detailedDescription: "The chickpea or chick pea is an annual legume of the family Fabaceae. Its different types are variously known as gram or Bengal gram, garbanzo or garbanzo bean, or Egyptian pea. Chickpea seeds are high in protein.",
        growingSeason: "Rabi (Winter season, sown between September and November)",
        harvestTime: "Spring (February to April)"
    },
    {
        name: "Kidney Beans",
        category: "Pulse",
        description: "A legume crop that requires suitable soil moisture and moderate environmental conditions.",
        conditions: "Moderate temperature, moderate rainfall",
        image: "https://images.unsplash.com/photo-1551061958-390db2077e6f?w=800&q=80",
        detailedDescription: "The kidney bean is a variety of the common bean (Phaseolus vulgaris). It is named for its visual resemblance in shape and color to a human kidney. It is a vital source of protein in many diets globally.",
        growingSeason: "Spring or early summer after frost has passed",
        harvestTime: "Summer to early Autumn (approx. 90-120 days after planting)"
    },
    {
        name: "Pigeon Peas",
        category: "Pulse",
        description: "A drought-tolerant pulse crop commonly cultivated in warm climates.",
        conditions: "Warm temperature, moderate rainfall",
        image: "https://images.unsplash.com/photo-1588691880496-03c626e2e50d?w=800&q=80",
        detailedDescription: "The pigeon pea (Cajanus cajan) is a perennial legume from the family Fabaceae. Since its domestication in the Indian subcontinent at least 3,500 years ago, its seeds have become a common food in Asia, Africa, and Latin America.",
        growingSeason: "Kharif season (June-July sowing)",
        harvestTime: "Winter/Spring (December to March)"
    },
    {
        name: "Moth Beans",
        category: "Pulse",
        description: "A hardy legume that can tolerate relatively dry and warm conditions.",
        conditions: "Warm temperature, lower rainfall",
        image: "https://images.unsplash.com/photo-1627993202996-3c2fa5be4df5?w=800&q=80",
        detailedDescription: "Vigna aconitifolia is a drought-resistant legume, commonly grown in arid and semi-arid regions of India. It is commonly called mat bean, moth bean, matki, or dew bean. The pods, sprouts, and protein-rich seeds of this crop are commonly consumed in India.",
        growingSeason: "Summer/Kharif (requires little water)",
        harvestTime: "Late Autumn"
    },
    {
        name: "Mung Bean",
        category: "Pulse",
        description: "A fast-growing legume crop that performs well in warm conditions.",
        conditions: "Warm temperature, moderate rainfall",
        image: "https://images.unsplash.com/photo-1533758364188-751240c5f7e7?w=800&q=80",
        detailedDescription: "The mung bean (Vigna radiata), alternatively known as the green gram, maash, or moong, is a plant species in the legume family. The mung bean is mainly cultivated in East, Southeast, and South Asia.",
        growingSeason: "Warm season, generally summer",
        harvestTime: "60-90 days after sowing"
    },
    {
        name: "Black Gram",
        category: "Pulse",
        description: "A legume crop commonly grown in warm climates with suitable soil moisture.",
        conditions: "Warm temperature, moderate rainfall",
        image: "https://images.unsplash.com/photo-1563220455-ab1ec093fcba?w=800&q=80",
        detailedDescription: "Vigna mungo, the black gram, urad bean, or black matpe bean, is a bean grown in the Indian subcontinent. It is a highly prized pulse, very rich in protein and a crucial ingredient in dishes like dal makhani.",
        growingSeason: "Kharif (June to September)",
        harvestTime: "Autumn"
    },
    {
        name: "Lentil",
        category: "Pulse",
        description: "A cool-season pulse crop that generally prefers moderate temperatures.",
        conditions: "Moderate temperature, moderate rainfall",
        image: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=800&q=80",
        detailedDescription: "The lentil (Lens culinaris or Lens esculenta) is an edible legume. It is an annual plant known for its lens-shaped seeds. It is about 40 cm tall, and the seeds grow in pods, usually with two seeds in each.",
        growingSeason: "Winter (Rabi season)",
        harvestTime: "Spring (March to April)"
    },
    {
        name: "Pomegranate",
        category: "Fruit",
        description: "A fruit crop that can tolerate relatively dry conditions once established.",
        conditions: "Warm temperature, moderate rainfall",
        image: "https://images.unsplash.com/photo-1522204565156-f4f5a3e144a1?w=800&q=80",
        detailedDescription: "The pomegranate (Punica granatum) is a fruit-bearing deciduous shrub in the family Lythraceae. It produces round fruits with a tough outer rind containing hundreds of juicy, edible seeds called arils.",
        growingSeason: "Spring planting, prefers hot and dry summers",
        harvestTime: "Late Summer to Autumn"
    },
    {
        name: "Banana",
        category: "Fruit",
        description: "A tropical fruit crop requiring warmth, moisture, and relatively high humidity.",
        conditions: "Warm temperature, high humidity",
        image: "https://images.unsplash.com/photo-1481349518771-20055b2a7b24?w=800&q=80",
        detailedDescription: "A banana is an elongated, edible fruit produced by several kinds of large herbaceous plants in the genus Musa. They are grown exclusively in tropical and subtropical climates and require consistent moisture.",
        growingSeason: "Year-round in tropical climates",
        harvestTime: "9 to 12 months after planting"
    },
    {
        name: "Mango",
        category: "Fruit",
        description: "A tropical fruit crop that prefers warm conditions and suitable seasonal rainfall.",
        conditions: "Warm temperature, moderate rainfall",
        image: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=800&q=80",
        detailedDescription: "Mangoes are juicy stone fruits from numerous species of tropical trees belonging to the flowering plant genus Mangifera, cultivated mostly for their edible fruit. It is known as the 'king of fruits'.",
        growingSeason: "Tropical/Subtropical climates, requires a dry period before flowering",
        harvestTime: "Summer (April to July)"
    },
    {
        name: "Grapes",
        category: "Fruit",
        description: "A fruit crop that generally benefits from suitable temperature and controlled moisture.",
        conditions: "Moderate temperature, moderate rainfall",
        image: "https://images.unsplash.com/photo-1537248927011-37d363d6b63c?w=800&q=80",
        detailedDescription: "A grape is a fruit, botanically a berry, of the deciduous woody vines of the botanical genus Vitis. Grapes can be eaten fresh or used for making wine, jam, grape juice, jelly, grape seed extract, raisins, and vinegar.",
        growingSeason: "Spring/Summer, prefers Mediterranean climates",
        harvestTime: "Late Summer to early Autumn"
    },
    {
        name: "Watermelon",
        category: "Fruit",
        description: "A warm-season fruit crop that requires adequate moisture during growth.",
        conditions: "Warm temperature, moderate rainfall",
        image: "https://images.unsplash.com/photo-1563114773-84221bd62bf3?w=800&q=80",
        detailedDescription: "Watermelon (Citrullus lanatus) is a flowering plant species of the Cucurbitaceae family and the name of its edible fruit. It is highly cultivated worldwide, with more than 1,000 varieties.",
        growingSeason: "Summer, requires plenty of sun and space",
        harvestTime: "Late Summer (approx. 70-90 days after sowing)"
    },
    {
        name: "Muskmelon",
        category: "Fruit",
        description: "A warm-season crop that performs well with suitable temperature and moderate moisture.",
        conditions: "Warm temperature, moderate rainfall",
        image: "https://images.unsplash.com/photo-1525055375597-2a5b28da1c5a?w=800&q=80",
        detailedDescription: "Muskmelon is a species of melon that has been developed into many cultivated varieties. These include smooth-skinned varieties such as honeydew and netted cultivars like cantaloupe.",
        growingSeason: "Summer",
        harvestTime: "Late Summer"
    },
    {
        name: "Apple",
        category: "Fruit",
        description: "A fruit crop generally associated with cooler growing conditions.",
        conditions: "Cooler temperature, suitable rainfall",
        image: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=800&q=80",
        detailedDescription: "An apple is an edible fruit produced by an apple tree (Malus domestica). Apple trees are cultivated worldwide and are the most widely grown species in the genus Malus.",
        growingSeason: "Requires a period of winter dormancy (chilling hours)",
        harvestTime: "Late Summer to late Autumn"
    },
    {
        name: "Orange",
        category: "Fruit",
        description: "A citrus fruit crop that grows well in warm conditions with adequate moisture.",
        conditions: "Warm temperature, moderate rainfall",
        image: "https://images.unsplash.com/photo-1611080661280-9280d0d82d49?w=800&q=80",
        detailedDescription: "The orange is the fruit of various citrus species in the family Rutaceae. It requires plenty of sunshine and water to produce sweet, juicy fruits.",
        growingSeason: "Subtropical climates, requires mild winters",
        harvestTime: "Winter to Spring"
    },
    {
        name: "Papaya",
        category: "Fruit",
        description: "A tropical fruit crop requiring warm temperatures and adequate moisture.",
        conditions: "Warm temperature, moderate rainfall",
        image: "https://images.unsplash.com/photo-1517282009859-f000ec3b26af?w=800&q=80",
        detailedDescription: "The papaya, papaw, or pawpaw is the plant Carica papaya. It is native to the tropics of the Americas, and was first cultivated in Mexico several centuries before the emergence of the Mesoamerican classical civilizations.",
        growingSeason: "Year-round in frost-free tropical climates",
        harvestTime: "6 to 9 months from seed"
    },
    {
        name: "Coconut",
        category: "Fruit",
        description: "A tropical crop that generally prefers warm and humid conditions.",
        conditions: "High humidity, warm temperature, rainfall",
        image: "https://images.unsplash.com/photo-1587786419736-1262d1c7d242?w=800&q=80",
        detailedDescription: "The coconut tree (Cocos nucifera) is a member of the palm tree family and the only living species of the genus Cocos. The term 'coconut' can refer to the whole coconut palm, the seed, or the fruit.",
        growingSeason: "Coastal tropical regions",
        harvestTime: "Year-round (takes about a year to mature)"
    },
    {
        name: "Cotton",
        category: "Commercial",
        description: "A major commercial crop requiring warm temperatures and suitable soil conditions.",
        conditions: "Warm temperature, moderate rainfall",
        image: "https://images.unsplash.com/photo-1594285885501-c852655ccf0b?w=800&q=80",
        detailedDescription: "Cotton is a soft, fluffy staple fiber that grows in a boll, or protective case, around the seeds of the cotton plants of the genus Gossypium in the mallow family Malvaceae.",
        growingSeason: "Long, warm growing season (frost-free)",
        harvestTime: "Autumn (approx. 150-160 days after planting)"
    },
    {
        name: "Jute",
        category: "Commercial",
        description: "A fiber crop that generally benefits from warm, humid, and wet conditions.",
        conditions: "High rainfall, high humidity, warm temperature",
        image: "https://images.unsplash.com/photo-1596704153926-d667c48f8a19?w=800&q=80",
        detailedDescription: "Jute is a long, soft, shiny bast fiber that can be spun into coarse, strong threads. It is produced from flowering plants in the genus Corchorus, which is in the mallow family Malvaceae.",
        growingSeason: "Kharif season (Requires standing water/flooding)",
        harvestTime: "Late Summer to Autumn"
    },
    {
        name: "Coffee",
        category: "Commercial",
        description: "A plantation crop that generally prefers warm conditions with adequate rainfall and humidity.",
        conditions: "High humidity, adequate rainfall",
        image: "https://images.unsplash.com/photo-1524350876685-274059332603?w=800&q=80",
        detailedDescription: "Coffee is a brewed drink prepared from roasted coffee beans, the seeds of berries from certain Coffea species. When coffee berries turn from green to bright red in color – indicating ripeness – they are picked, processed, and dried.",
        growingSeason: "Tropical highlands, requires distinct dry and wet seasons",
        harvestTime: "Winter (varies based on latitude)"
    },
];

function Crops() {
    return (
        <main className="min-h-screen bg-slate-50 px-4 pt-16 pb-10 sm:px-6 lg:px-8">

            {/* Header */}
            <motion.section 
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: { opacity: 0 },
                    visible: {
                        opacity: 1,
                        transition: { staggerChildren: 0.15 }
                    }
                }}
                className="mx-auto max-w-5xl"
            >

                <motion.p variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }} className="text-sm font-bold tracking-widest text-green-600">
                    SUPPORTED CROPS
                </motion.p>

                <motion.h1 variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }} className="mt-3 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                    Crop Information
                </motion.h1>

                <motion.p variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }} className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
                    Explore the crops that our machine-learning model
                    can recommend based on soil and environmental
                    conditions.
                </motion.p>

            </motion.section>

            {/* Crop Cards */}
            <section className="mx-auto mt-10 max-w-5xl">

                <motion.div 
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: { delayChildren: 0.3, staggerChildren: 0.05 }
                        }
                    }}
                    className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
                >

                    {crops.map((crop) => (
                        <Link to={`/crops/${crop.name.toLowerCase()}`} key={crop.name}>
                            <motion.article
                                variants={{ hidden: { opacity: 0, scale: 0.9, y: 20 }, visible: { opacity: 1, scale: 1, y: 0 } }}
                                className="group h-full flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                            >

                                {/* Crop Image */}
                                <div className="relative h-48 w-full overflow-hidden">
                                    <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors z-10" />
                                    <img 
                                        src={crop.image} 
                                        alt={crop.name} 
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        loading="lazy"
                                    />
                                </div>

                                <div className="flex flex-1 flex-col p-6">
                                    {/* Icon + Category */}
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-100 text-2xl group-hover:bg-green-200 transition-colors">
                                            🌱
                                        </div>
                                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                                            {crop.category}
                                        </span>
                                    </div>

                                    {/* Crop Name */}
                                    <h2 className="mt-5 text-xl font-bold capitalize text-slate-900 group-hover:text-green-600 transition-colors">
                                        {crop.name}
                                    </h2>

                                    {/* Description */}
                                    <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">
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
                                </div>

                            </motion.article>
                        </Link>
                    ))}

                </motion.div>

            </section>

        </main>
    );
}

export default Crops;