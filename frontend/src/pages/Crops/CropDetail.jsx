import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { crops } from "./index";

function CropDetail() {
    const { cropName } = useParams();

    // Find the matching crop based on the URL parameter (case-insensitive)
    const crop = crops.find(c => c.name.toLowerCase() === cropName.toLowerCase());

    if (!crop) {
        return (
            <main className="flex min-h-[60vh] flex-col items-center justify-center bg-slate-50 px-4 text-center">
                <h1 className="text-4xl font-bold text-slate-900">Crop Not Found</h1>
                <p className="mt-4 text-lg text-slate-600">The crop "{cropName}" does not exist in our database.</p>
                <Link to="/crops" className="mt-8 rounded-full bg-green-600 px-6 py-3 text-sm font-semibold text-white hover:bg-green-500 transition-colors">
                    Back to Crops
                </Link>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50 pb-16">
            {/* Hero Image Section */}
            <div className="relative h-[40vh] w-full min-h-[300px]">
                <div className="absolute inset-0 bg-slate-900/40 z-10"></div>
                <img 
                    src={crop.image} 
                    alt={crop.name} 
                    className="absolute inset-0 h-full w-full object-cover" 
                />
                
                <div className="absolute inset-0 z-20 flex flex-col justify-end pb-12">
                    <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
                        <Link to="/crops" className="mb-6 inline-flex items-center text-sm font-medium text-white/80 hover:text-white transition-colors">
                            <span className="mr-2">←</span> Back to all crops
                        </Link>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <span className="inline-block rounded-full bg-green-500/20 px-3 py-1 text-xs font-semibold tracking-wider text-green-200 ring-1 ring-inset ring-green-500/50 mb-3 uppercase">
                                {crop.category}
                            </span>
                            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white capitalize">
                                {crop.name}
                            </h1>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="mx-auto mt-8 sm:mt-12 w-full max-w-5xl px-4 sm:px-6 lg:px-8">
                <div className="grid gap-6 sm:gap-10 lg:grid-cols-3">
                    
                    {/* Main Description */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="lg:col-span-2"
                    >
                        <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-8 shadow-sm">
                            <h2 className="text-2xl font-bold text-slate-900">Overview</h2>
                            <p className="mt-4 text-lg leading-8 text-slate-600">
                                {crop.detailedDescription}
                            </p>
                            
                            <div className="mt-10 border-t border-slate-100 pt-8">
                                <h3 className="text-xl font-bold text-slate-900">Why grow {crop.name}?</h3>
                                <p className="mt-4 text-base leading-7 text-slate-600">
                                    {crop.description}
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Sidebar Details */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex flex-col gap-6"
                    >
                        {/* Suitable Conditions */}
                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-500 text-xl">
                                    🌤️
                                </div>
                                <h3 className="font-bold text-slate-900">Suitable Conditions</h3>
                            </div>
                            <p className="text-sm font-medium leading-6 text-slate-600">
                                {crop.conditions}
                            </p>
                        </div>

                        {/* Growing Season */}
                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-500 text-xl">
                                    🌱
                                </div>
                                <h3 className="font-bold text-slate-900">Growing Season</h3>
                            </div>
                            <p className="text-sm font-medium leading-6 text-slate-600">
                                {crop.growingSeason}
                            </p>
                        </div>

                        {/* Harvest Time */}
                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-500 text-xl">
                                    🌾
                                </div>
                                <h3 className="font-bold text-slate-900">Harvest Time</h3>
                            </div>
                            <p className="text-sm font-medium leading-6 text-slate-600">
                                {crop.harvestTime}
                            </p>
                        </div>
                        
                    </motion.div>
                    
                </div>
            </div>
        </main>
    );
}

export default CropDetail;
