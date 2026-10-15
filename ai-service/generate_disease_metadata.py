import os
import json

MAPPING_FILE = r"d:\Smart-agriculture-project\Plant_Images\train_mapping.txt"
OUTPUT_FILE = r"d:\Smart-agriculture-project\ai-service\models\disease_classes.json"

raw_mapping = {}
with open(MAPPING_FILE, "r") as f:
    for line in f:
        line = line.strip()
        if not line:
            continue
        parts = line.split("\t")
        if len(parts) == 2:
            raw_path, svm_path = parts
            raw_class = raw_path.split("/")[2]
            class_id = int(svm_path.split("/")[2])
            raw_mapping[class_id] = raw_class

# Comprehensive agronomic metadata dictionary for all 38 classes
DISEASE_INFO_TEMPLATE = {
    "Apple___Apple_scab": {
        "crop": "Apple",
        "disease": "Apple Scab",
        "is_healthy": False,
        "severity": "Moderate",
        "symptoms": "Olive-green to black velvety spots on leaves and scabby lesions on fruits. Leaf curling and premature drop.",
        "organic_treatment": "Apply sulfur or copper sprays early in spring. Prune trees to increase airflow and remove fallen leaves promptly.",
        "chemical_treatment": "Fungicides containing Captan, Mancozeb, or Myclobutanil during bud break and petal fall.",
        "prevention": "Plant resistant cultivars (e.g., Honeycrisp, Enterprise). Ensure proper tree pruning and sanitize orchard ground."
    },
    "Apple___Black_rot": {
        "crop": "Apple",
        "disease": "Black Rot (Frogeye Leaf Spot)",
        "is_healthy": False,
        "severity": "High",
        "symptoms": "Purple flecks expanding into circular lesions with light brown centers ('frogeye' spots) and rotting black fruit with concentric rings.",
        "organic_treatment": "Remove and burn mummified fruits and dead limbs. Spray bio-fungicide like Bacillus subtilis.",
        "chemical_treatment": "Captan or Thiophanate-methyl applications from silver tip through harvest intervals.",
        "prevention": "Prune out dead wood and fire-blight strikes; control insect damage which serves as infection entry points."
    },
    "Apple___Cedar_apple_rust": {
        "crop": "Apple",
        "disease": "Cedar Apple Rust",
        "is_healthy": False,
        "severity": "Moderate",
        "symptoms": "Bright orange or yellow spots on the upper leaf surface with tube-like spore structures on the lower surface.",
        "organic_treatment": "Apply liquid copper or sulfur sprays before floral bloom. Remove nearby Eastern red cedar galls.",
        "chemical_treatment": "Apply sterol-inhibiting fungicides such as Myclobutanil or Propiconazole at pink bud stage.",
        "prevention": "Avoid planting susceptible apple trees within several hundred feet of Juniper/Cedar trees."
    },
    "Apple___healthy": {
        "crop": "Apple",
        "disease": "Healthy",
        "is_healthy": True,
        "severity": "None",
        "symptoms": "Foliage is vibrant green, firm, and showing robust physiological vigor with no visible blemishes or necrosis.",
        "organic_treatment": "Maintain balanced organic fertilization, compost topdressing, and regular drip irrigation.",
        "chemical_treatment": "No chemical treatment required.",
        "prevention": "Continue standard seasonal pest scouting and clean orchard maintenance."
    },
    "Blueberry___healthy": {
        "crop": "Blueberry",
        "disease": "Healthy",
        "is_healthy": True,
        "severity": "None",
        "symptoms": "Leaves are glossy, uniform deep green with clean margins and vigorous stem development.",
        "organic_treatment": "Maintain acidic soil pH (4.5–5.2) using elemental sulfur and organic pine bark mulch.",
        "chemical_treatment": "No chemical treatment required.",
        "prevention": "Maintain acidic soil moisture and monitor for spotted wing drosophila."
    },
    "Cherry_(including_sour)___Powdery_mildew": {
        "crop": "Cherry",
        "disease": "Powdery Mildew",
        "is_healthy": False,
        "severity": "Moderate",
        "symptoms": "White powdery fungal coating on leaves and young shoots, causing leaf distortion and curling upwards.",
        "organic_treatment": "Neem oil, potassium bicarbonate spray, or diluted whey/milk solution applied on affected foliage.",
        "chemical_treatment": "Apply sulfur or quinoxyfen, myclobutanil, or tebuconazole fungicides.",
        "prevention": "Avoid overhead watering; prune canopy to promote sunshine penetration and low relative humidity."
    },
    "Cherry_(including_sour)___healthy": {
        "crop": "Cherry",
        "disease": "Healthy",
        "is_healthy": True,
        "severity": "None",
        "symptoms": "Leaves exhibit healthy dark green coloration, no signs of fungal spots or shot-hole lesions.",
        "organic_treatment": "Standard annual mulching and balanced foliar micronutrient feeding.",
        "chemical_treatment": "No chemical treatment required.",
        "prevention": "Maintain dormant copper spray in winter to prevent bacterial canker."
    },
    "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot": {
        "crop": "Corn (Maize)",
        "disease": "Gray Leaf Spot (Cercospora)",
        "is_healthy": False,
        "severity": "High",
        "symptoms": "Rectangular, tan-to-gray leaf lesions delimited by veins, coalescing to cause extensive foliar blighting.",
        "organic_treatment": "Crop rotation with non-host legumes; thorough incorporation of crop residue after harvest.",
        "chemical_treatment": "Foliar fungicides with strobilurin (azoxystrobin) or triazole chemistry applied between V12 and R2 stages.",
        "prevention": "Plant resistant hybrid maize seed varieties and practice 2-year crop rotation."
    },
    "Corn_(maize)___Common_rust_": {
        "crop": "Corn (Maize)",
        "disease": "Common Rust",
        "is_healthy": False,
        "severity": "Moderate",
        "symptoms": "Oval, cinnamon-brown to golden-brown pustules scattered across both upper and lower leaf surfaces.",
        "organic_treatment": "Ensure adequate spacing and plant early in season to avoid late-season airborne spore peaks.",
        "chemical_treatment": "Pyraclostrobin or Propiconazole foliar sprays if rust pustules appear before blister stage.",
        "prevention": "Use certified rust-resistant maize hybrid seeds."
    },
    "Corn_(maize)___Northern_Leaf_Blight": {
        "crop": "Corn (Maize)",
        "disease": "Northern Leaf Blight",
        "is_healthy": False,
        "severity": "High",
        "symptoms": "Long, cigar-shaped grayish-green to tan lesions (1 to 6 inches long) primarily on lower leaves first.",
        "organic_treatment": "Deep tillage to bury infected stalk debris and ensure wide crop rotation away from continuous corn.",
        "chemical_treatment": "Triazole or strobilurin fungicides applied at tasseling stage if disease pressure is high.",
        "prevention": "Plant resistant hybrids (Ht genes) and maintain proper soil potassium levels."
    },
    "Corn_(maize)___healthy": {
        "crop": "Corn (Maize)",
        "disease": "Healthy",
        "is_healthy": True,
        "severity": "None",
        "symptoms": "Leaves are broad, healthy dark emerald green, showing upright turgidity and no lesions.",
        "organic_treatment": "Optimal nitrogen side-dressing and organic compost application.",
        "chemical_treatment": "No chemical treatment required.",
        "prevention": "Maintain uniform irrigation and soil weed management."
    },
    "Grape___Black_rot": {
        "crop": "Grape",
        "disease": "Black Rot",
        "is_healthy": False,
        "severity": "High",
        "symptoms": "Small, reddish-brown circular spots on leaves; berries shrivel into hard, black, wrinkled mummies.",
        "organic_treatment": "Remove and destroy mummified grape clusters and infected canes during winter pruning. Apply copper.",
        "chemical_treatment": "Mancozeb, Ziram, or Myclobutanil applications from bud break through 4 weeks post-bloom.",
        "prevention": "Maintain an open vine canopy for fast leaf drying after rain."
    },
    "Grape___Esca_(Black_Measles)": {
        "crop": "Grape",
        "disease": "Esca (Black Measles)",
        "is_healthy": False,
        "severity": "High",
        "symptoms": "Tiger-stripe patterns of yellow/brown necrosis between veins; dark spots on berries and sudden vine apoplexy.",
        "organic_treatment": "Trunk renewal; paint pruning wounds with Trichoderma harzianum bio-protectant paste.",
        "chemical_treatment": "No curative systemic fungicide exists; apply wound-protectant pastes like thiophanate-methyl.",
        "prevention": "Prune during dry winter periods to minimize wound infection by wood-rotting fungi."
    },
    "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)": {
        "crop": "Grape",
        "disease": "Leaf Blight (Isariopsis Spot)",
        "is_healthy": False,
        "severity": "Moderate",
        "symptoms": "Irregular dark brown lesions with distinct borders on older leaves, causing defoliation in late summer.",
        "organic_treatment": "Bordeaux mixture (copper sulfate + lime) spray during post-bloom season.",
        "chemical_treatment": "Dithiocarbamate or chlorothalonil fungicide applications.",
        "prevention": "Ensure good air circulation within the trellis trellis system."
    },
    "Grape___healthy": {
        "crop": "Grape",
        "disease": "Healthy",
        "is_healthy": True,
        "severity": "None",
        "symptoms": "Lush green foliage with pristine leaves, strong tendril growth, and clean canes.",
        "organic_treatment": "Balanced soil management, potassium and magnesium foliar feeds.",
        "chemical_treatment": "No chemical treatment required.",
        "prevention": "Routine canopy management and shoot positioning."
    },
    "Orange___Haunglongbing_(Citrus_greening)": {
        "crop": "Orange (Citrus)",
        "disease": "Huanglongbing (Citrus Greening)",
        "is_healthy": False,
        "severity": "High",
        "symptoms": "Asymmetric blotchy mottling on leaves, yellow shoots, vein corking, and bitter, lopsided fruit that stays green at base.",
        "organic_treatment": "Strict biological control of the Asian citrus psyllid vector using Tamarixia radiata parasitoid wasps. Soil nutrition boosts.",
        "chemical_treatment": "Control psyllid vectors with systemic insecticides (imidacloprid, thiamethoxam). Soil antimicrobial trunk injections where permitted.",
        "prevention": "Use certified disease-free nursery stock, remove infected trees quickly to prevent grove-wide spread."
    },
    "Peach___Bacterial_spot": {
        "crop": "Peach",
        "disease": "Bacterial Spot",
        "is_healthy": False,
        "severity": "Moderate",
        "symptoms": "Angular, water-soaked purplish lesions that drop out creating a shot-hole appearance; cracked fruit.",
        "organic_treatment": "Oxytetracycline or copper sprays at low concentrations to avoid phytotoxicity.",
        "chemical_treatment": "Copper bactericides applied from dormant stage through petal fall.",
        "prevention": "Plant resistant peach cultivars and avoid planting in sandy, wind-exposed sites without windbreaks."
    },
    "Peach___healthy": {
        "crop": "Peach",
        "disease": "Healthy",
        "is_healthy": True,
        "severity": "None",
        "symptoms": "Glossy lanceolate leaves free of spotting, healthy shoot extension, and robust green growth.",
        "organic_treatment": "Balanced nitrogen management and organic compost mulch.",
        "chemical_treatment": "No chemical treatment required.",
        "prevention": "Maintain dormant copper sprays against peach leaf curl during winter."
    },
    "Pepper,_bell___Bacterial_spot": {
        "crop": "Bell Pepper",
        "disease": "Bacterial Spot",
        "is_healthy": False,
        "severity": "High",
        "symptoms": "Small, water-soaked circular to irregular lesions turning brown with yellow halos. Severe leaf drop exposing fruit to sunscald.",
        "organic_treatment": "Copper-based bactericides combined with bio-stimulants; avoid handling wet plants.",
        "chemical_treatment": "Copper hydroxide mixed with Mancozeb spray program during rainy weather.",
        "prevention": "Use hot-water treated or certified disease-free seeds; drip irrigate instead of overhead sprinklers."
    },
    "Pepper,_bell___healthy": {
        "crop": "Bell Pepper",
        "disease": "Healthy",
        "is_healthy": True,
        "severity": "None",
        "symptoms": "Deep emerald foliage, crisp erect leaves, healthy blossoms, and uniform growth.",
        "organic_treatment": "Seaweed extract foliar spray and calcium-rich bone meal soil feeding.",
        "chemical_treatment": "No chemical treatment required.",
        "prevention": "Maintain even soil moisture to prevent blossom-end rot."
    },
    "Potato___Early_blight": {
        "crop": "Potato",
        "disease": "Early Blight",
        "is_healthy": False,
        "severity": "Moderate",
        "symptoms": "Dark brown, circular lesions with characteristic concentric rings ('target board' pattern) on older lower leaves.",
        "organic_treatment": "Copper soaps, Bacillus amyloliquefaciens bio-fungicide, and removing lower diseased foliage.",
        "chemical_treatment": "Chlorothalonil, Mancozeb, or Azoxystrobin applications starting when canopy closes.",
        "prevention": "Maintain plant vigor with adequate nitrogen and avoid overhead irrigation late in the afternoon."
    },
    "Potato___Late_blight": {
        "crop": "Potato",
        "disease": "Late Blight (Phytophthora)",
        "is_healthy": False,
        "severity": "High",
        "symptoms": "Water-soaked dark lesions on leaf tips and stems with white fuzzy fungal growth on the underside during humid weather. Rapid plant collapse.",
        "organic_treatment": "Immediate copper hydroxide or copper sulfate spray. Destroy heavily infected vines before tuber harvest.",
        "chemical_treatment": "Systemic fungicides such as Metalaxyl, Dimethomorph, or Cymoxanil applied on weather forecast alert.",
        "prevention": "Plant certified disease-free seed tubers, eliminate volunteer potatoes, and monitor blighted culms."
    },
    "Potato___healthy": {
        "crop": "Potato",
        "disease": "Healthy",
        "is_healthy": True,
        "severity": "None",
        "symptoms": "Robust green canopy, turgid leaves, and healthy stem architecture with zero foliar spotting.",
        "organic_treatment": "Hill plants with rich compost and mulch to protect developing tubers.",
        "chemical_treatment": "No chemical treatment required.",
        "prevention": "Follow a strict 3-year crop rotation with non-solanaceous crops."
    },
    "Raspberry___healthy": {
        "crop": "Raspberry",
        "disease": "Healthy",
        "is_healthy": True,
        "severity": "None",
        "symptoms": "Compound leaves are vibrant green with serrated margins, free from cane blight or rust spots.",
        "organic_treatment": "Topdress with aged manure and pine mulch; ensure adequate trellis support.",
        "chemical_treatment": "No chemical treatment required.",
        "prevention": "Prune out spent floricanes after summer fruiting."
    },
    "Soybean___healthy": {
        "crop": "Soybean",
        "disease": "Healthy",
        "is_healthy": True,
        "severity": "None",
        "symptoms": "Trifoliate leaves are uniformly green, free from defoliation or frogeye lesions.",
        "organic_treatment": "Ensure active Rhizobium bacterial inoculation for biological nitrogen fixation.",
        "chemical_treatment": "No chemical treatment required.",
        "prevention": "Scout periodically for soybean aphids and pod borers."
    },
    "Squash___Powdery_mildew": {
        "crop": "Squash",
        "disease": "Powdery Mildew",
        "is_healthy": False,
        "severity": "Moderate",
        "symptoms": "Talcum-powder like white fungal patches covering both leaf surfaces, leading to leaf yellowing and sun-scorched fruit.",
        "organic_treatment": "Potassium bicarbonate spray, horticultural neem oils, or sulfur dusting.",
        "chemical_treatment": "Myclobutanil, Trifloxystrobin, or Boscalid fungicides applied upon first appearance.",
        "prevention": "Plant resistant squash varieties and allow wide spacing for sunlight penetration."
    },
    "Strawberry___Leaf_scorch": {
        "crop": "Strawberry",
        "disease": "Leaf Scorch",
        "is_healthy": False,
        "severity": "Moderate",
        "symptoms": "Irregular purple to brown blotches covering leaves; tissue between spots turns brown and leaf edges curl up dry.",
        "organic_treatment": "Remove and compost severely blighted leaves after harvest. Apply liquid copper.",
        "chemical_treatment": "Captan, Pyraclostrobin, or Cyprodinil fungicides applied in early spring growth.",
        "prevention": "Renovate strawberry beds annually, avoid high nitrogen fertilizer that promotes excess dense foliage."
    },
    "Strawberry___healthy": {
        "crop": "Strawberry",
        "disease": "Healthy",
        "is_healthy": True,
        "severity": "None",
        "symptoms": "Lush trifoliate leaves with bright serrated margins, strong runner growth, and clean crowns.",
        "organic_treatment": "Mulch beds with clean straw to elevate fruit and foliage off wet soil.",
        "chemical_treatment": "No chemical treatment required.",
        "prevention": "Maintain drip irrigation and remove runner overcrowding."
    },
    "Tomato___Bacterial_spot": {
        "crop": "Tomato",
        "disease": "Bacterial Spot",
        "is_healthy": False,
        "severity": "High",
        "symptoms": "Small, water-soaked dark spots on leaves with yellow halos, coalescing to cause leaf scorch and defoliation.",
        "organic_treatment": "Copper bactericides mixed with Bacillus subtilis; sterilize pruning shears between plants.",
        "chemical_treatment": "Copper hydroxide combined with Mancozeb sprays at 7–10 day intervals in warm wet weather.",
        "prevention": "Use certified seed, water at base of stems, avoid overhead sprinklers."
    },
    "Tomato___Early_blight": {
        "crop": "Tomato",
        "disease": "Early Blight",
        "is_healthy": False,
        "severity": "Moderate",
        "symptoms": "Brown to black lesions with concentric rings ('target' shape) developing on lower leaves first, causing lower defoliation.",
        "organic_treatment": "Prune bottom 12 inches of leaves; apply copper fungicides and mulch heavily to prevent soil splash.",
        "chemical_treatment": "Chlorothalonil, Mancozeb, or Azoxystrobin applied every 7-14 days.",
        "prevention": "Stake plants upright, rotate tomatoes with non-solanaceous crops for 3 years."
    },
    "Tomato___Late_blight": {
        "crop": "Tomato",
        "disease": "Late Blight",
        "is_healthy": False,
        "severity": "High",
        "symptoms": "Large, dark greasy-looking spots on leaves and stems with white mold on underside in wet weather. Plants can collapse in days.",
        "organic_treatment": "Liquid copper spray immediately upon disease advisory; pull and destroy infected plants if severe.",
        "chemical_treatment": "Cymoxanil, Dimethomorph, or Mandipropamid fungicides applied preventatively.",
        "prevention": "Plant resistant varieties (e.g., Mountain Magic, Defiant), eliminate volunteer potato/tomato plants."
    },
    "Tomato___Leaf_Mold": {
        "crop": "Tomato",
        "disease": "Leaf Mold (Passalora fulva)",
        "is_healthy": False,
        "severity": "Moderate",
        "symptoms": "Pale greenish-yellow spots on upper leaf surfaces and olive-green to brown velvety fungal patches on lower leaf surfaces.",
        "organic_treatment": "Increase greenhouse ventilation, reduce humidity below 85%, spray bio-fungicide (Bacillus subtilis).",
        "chemical_treatment": "Chlorothalonil, Copper hydroxide, or Difenoconazole fungicides.",
        "prevention": "Ensure good spacing and circulation in high tunnels or greenhouses; avoid wetting foliage."
    },
    "Tomato___Septoria_leaf_spot": {
        "crop": "Tomato",
        "disease": "Septoria Leaf Spot",
        "is_healthy": False,
        "severity": "Moderate",
        "symptoms": "Numerous small circular spots with dark brown margins and gray centers containing tiny black speck pycnidia.",
        "organic_treatment": "Remove lower infected leaves, apply organic copper spray, apply straw mulch to block soil-splash spores.",
        "chemical_treatment": "Chlorothalonil, Mancozeb, or Copper fungicide applications at first appearance.",
        "prevention": "3-year crop rotation, stake vines, remove tomato debris at end of season."
    },
    "Tomato___Spider_mites Two-spotted_spider_mite": {
        "crop": "Tomato",
        "disease": "Two-Spotted Spider Mites",
        "is_healthy": False,
        "severity": "Moderate",
        "symptoms": "Fine yellow stippling or bronzing on leaves, delicate webbing under leaves, dry brittle appearance.",
        "organic_treatment": "Release predatory mites (Phytoseiulus persimilis), spray insecticidal soap, rosemary oil or neem oil.",
        "chemical_treatment": "Abamectin, Bifenazate, or Spiromesifen miticides applied to undersides of leaves.",
        "prevention": "Avoid drought stress; spray water to wash dust off plants which discourages mite colonization."
    },
    "Tomato___Target_Spot": {
        "crop": "Tomato",
        "disease": "Target Spot (Corynespora cassiicola)",
        "is_healthy": False,
        "severity": "Moderate",
        "symptoms": "Pinpoint brown spots expanding into circular lesions with light brown centers and dark concentric rings.",
        "organic_treatment": "Copper octanoate or biofungicides; prune lower suckers to improve airflow.",
        "chemical_treatment": "Famoxadone + Cymoxanil or Boscalid + Pyraclostrobin sprays.",
        "prevention": "Stake plants off ground, control weeds that act as alternate hosts."
    },
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus": {
        "crop": "Tomato",
        "disease": "Tomato Yellow Leaf Curl Virus (TYLCV)",
        "is_healthy": False,
        "severity": "High",
        "symptoms": "Stunted upright plant growth, leaves curled upward with prominent yellowing (chlorosis) along margins, floral abortion.",
        "organic_treatment": "Install yellow sticky traps to catch whitefly vectors; spray insecticidal soaps or neem oil. Pull out infected plants.",
        "chemical_treatment": "Control whiteflies using Imidacloprid, Dinotefuran, or Spirotetramat (virus itself has no chemical cure).",
        "prevention": "Use TYLCV-resistant tomato cultivars, use fine mesh insect netting, control weeds around field edges."
    },
    "Tomato___Tomato_mosaic_virus": {
        "crop": "Tomato",
        "disease": "Tomato Mosaic Virus (ToMV)",
        "is_healthy": False,
        "severity": "High",
        "symptoms": "Mottled light and dark green mosaic pattern on leaves, fern-like leaf distortion (shoestringing), and uneven fruit ripening.",
        "organic_treatment": "No cure; rogue out and burn infected plants immediately. Wash hands in milk or detergent before handling plants.",
        "chemical_treatment": "No chemical treatment cures plant viruses.",
        "prevention": "Plant resistant varieties (look for 'Tm' or 'ToMV' label), disinfect all gardening tools with 20% bleach solution, avoid tobacco use near plants."
    },
    "Tomato___healthy": {
        "crop": "Tomato",
        "disease": "Healthy",
        "is_healthy": True,
        "severity": "None",
        "symptoms": "Rich green foliage, turgid leaves, vigorous apical growth, and healthy blossoms with no signs of pest or fungal damage.",
        "organic_treatment": "Apply calcium nitrate or bone meal to prevent blossom-end rot; mulch base and prune suckers.",
        "chemical_treatment": "No chemical treatment required.",
        "prevention": "Maintain steady drip irrigation and annual crop rotation."
    }
}

classes_dict = {}
for class_id in sorted(raw_mapping.keys()):
    raw_name = raw_mapping[class_id]
    info = DISEASE_INFO_TEMPLATE.get(raw_name, {
        "crop": raw_name.split("___")[0].replace("_", " "),
        "disease": raw_name.split("___")[1].replace("_", " "),
        "is_healthy": "healthy" in raw_name.lower(),
        "severity": "None" if "healthy" in raw_name.lower() else "Moderate",
        "symptoms": "Disease lesions observed on plant foliage.",
        "organic_treatment": "Organic copper spray or bio-fungicide.",
        "chemical_treatment": "Targeted broad-spectrum fungicide.",
        "prevention": "Crop rotation and clean field sanitation."
    })
    classes_dict[str(class_id)] = {
        "class_id": class_id,
        "raw_name": raw_name,
        **info
    }

os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump(classes_dict, f, indent=2, ensure_ascii=False)

print(f"Successfully generated disease classes metadata with {len(classes_dict)} classes at {OUTPUT_FILE}")
