import { Link } from "react-router-dom";
import { motion } from "motion/react";

function Home() {

    return (
        <main className="min-h-screen bg-white pb-10">

            {/* Hero Section */}
            <section className="relative flex min-h-[100vh] flex-col items-center justify-center overflow-hidden bg-slate-900 text-center px-4">
                
                {/* Animated Background Elements */}
                <div className="absolute top-1/4 left-1/4 h-96 w-96 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-green-500/20 blur-[100px]"></div>
                <div className="absolute bottom-1/4 right-1/4 h-96 w-96 translate-x-1/2 translate-y-1/2 animate-pulse rounded-full bg-yellow-500/20 blur-[100px]" style={{ animationDelay: '1s' }}></div>

                {/* Floating Elements (Decorative - hidden on small mobile to prevent text clash) */}
                <div className="hidden sm:block absolute left-[10%] top-[25%] text-4xl lg:text-5xl opacity-80 animate-bounce" style={{ animationDuration: '3s' }}>🌾</div>
                <div className="hidden sm:block absolute right-[15%] top-[20%] text-5xl lg:text-6xl opacity-80 animate-bounce" style={{ animationDuration: '4s' }}>🚜</div>
                <div className="hidden sm:block absolute left-[20%] bottom-[25%] text-4xl lg:text-5xl opacity-80 animate-bounce" style={{ animationDuration: '2.5s' }}>💧</div>
                <div className="hidden sm:block absolute right-[10%] bottom-[30%] text-5xl lg:text-6xl opacity-80 animate-bounce" style={{ animationDuration: '3.5s' }}>☀️</div>

                <motion.div 
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: { staggerChildren: 0.2 }
                        }
                    }}
                    className="relative z-10 mx-auto max-w-4xl"
                >
                    <motion.span 
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0 }
                        }}
                        className="inline-block rounded-full bg-green-500/10 px-4 py-1.5 sm:px-5 sm:py-2 text-xs sm:text-sm font-semibold tracking-wider text-green-400 ring-1 ring-inset ring-green-500/20"
                    >
                        ✨ AI-POWERED AGRICULTURE
                    </motion.span>

                    <motion.h1 
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0 }
                        }}
                        className="mt-6 sm:mt-8 text-3xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-white"
                    >
                        Plant the <span className="text-green-400 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-yellow-400">Perfect Crop</span> Every Time
                    </motion.h1>

                    <motion.p 
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0 }
                        }}
                        className="mx-auto mt-4 sm:mt-6 max-w-2xl text-base sm:text-xl leading-7 sm:leading-8 text-slate-300"
                    >
                        Take the guesswork out of farming. Give us your soil and weather data, and our advanced AI will instantly tell you what to grow for a maximum yield.
                    </motion.p>

                    <motion.div 
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0 }
                        }}
                        className="mt-10 flex flex-wrap items-center justify-center gap-4"
                    >
                        <Link
                            to="/recommend"
                            className="group relative inline-flex items-center gap-2 rounded-full bg-green-500 px-8 py-4 text-base sm:text-lg font-bold text-slate-900 transition-all hover:scale-105 hover:bg-green-400 focus:outline-none focus:ring-4 focus:ring-green-500/30"
                        >
                            Get Crop Recommendation
                            <span className="transition-transform group-hover:translate-x-1">→</span>
                        </Link>

                        <Link
                            to="/disease"
                            className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/90 px-7 py-4 text-base sm:text-lg font-bold text-white transition-all hover:bg-slate-700 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-slate-600/30"
                        >
                            <span>🩺</span> Scan Leaf Disease
                        </Link>
                    </motion.div>
                </motion.div>

                {/* Bottom curving separator */}
                <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-20 translate-y-[1px]">
                    <svg className="relative block h-[60px] w-full sm:h-[100px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
                        <path className="fill-white" d="M0,224L48,213.3C96,203,192,181,288,186.7C384,192,480,224,576,234.7C672,245,768,235,864,208C960,181,1056,139,1152,133.3C1248,128,1344,160,1392,176L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                    </svg>
                </div>

            </section>


            {/* How It Works */}
            <section className="mx-auto mt-16 w-full max-w-5xl px-4 sm:px-6 lg:px-8">
                <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    <p className="text-sm font-bold tracking-widest text-green-600">
                        HOW IT WORKS
                    </p>
                    <h2 className="mt-3 text-3xl font-bold text-slate-900">
                        From Field Data to Crop Recommendation
                    </h2>
                    <p className="mx-auto mt-3 max-w-2xl text-slate-500">
                        Our application combines machine learning and generative
                        AI to provide a simple crop recommendation.
                    </p>
                </motion.div>

                <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: { staggerChildren: 0.15 }
                        }
                    }}
                    className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
                >
                    {/* Step 1 */}
                    <motion.div variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }} className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl">
                            🌱
                        </div>
                        <p className="mt-4 text-xs font-bold tracking-widest text-green-600">
                            STEP 1
                        </p>
                        <h3 className="mt-2 text-lg font-semibold text-slate-900">
                            Enter Field Data
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            Provide soil nutrients, pH, temperature, humidity,
                            and rainfall information.
                        </p>
                    </motion.div>

                    {/* Step 2 */}
                    <motion.div variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }} className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-2xl">
                            🤖
                        </div>
                        <p className="mt-4 text-xs font-bold tracking-widest text-blue-600">
                            STEP 2
                        </p>
                        <h3 className="mt-2 text-lg font-semibold text-slate-900">
                            ML Prediction
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            A Random Forest model analyzes the provided
                            agricultural conditions.
                        </p>
                    </motion.div>

                    {/* Step 3 */}
                    <motion.div variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }} className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-purple-100 text-2xl">
                            💡
                        </div>
                        <p className="mt-4 text-xs font-bold tracking-widest text-purple-600">
                            STEP 3
                        </p>
                        <h3 className="mt-2 text-lg font-semibold text-slate-900">
                            AI Explanation
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            Gemini generates a simple explanation of the
                            recommendation and farming considerations.
                        </p>
                    </motion.div>

                    {/* Step 4 */}
                    <motion.div variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }} className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-yellow-100 text-2xl">
                            🌾
                        </div>
                        <p className="mt-4 text-xs font-bold tracking-widest text-yellow-600">
                            STEP 4
                        </p>
                        <h3 className="mt-2 text-lg font-semibold text-slate-900">
                            Crop Recommendation
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            The application displays the recommended crop,
                            model confidence, and AI explanation.
                        </p>
                    </motion.div>
                </motion.div>
            </section>
            
            {/* New: Plant Doctor & Disease Detection Feature Section */}
            <section className="mx-auto mt-20 w-full max-w-5xl px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="relative overflow-hidden rounded-3xl bg-linear-to-br from-slate-900 via-slate-800 to-emerald-950 p-8 sm:p-12 text-white shadow-xl border border-slate-800"
                >
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                        <div className="md:col-span-7 space-y-4">
                            <span className="inline-block rounded-full bg-emerald-500/20 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-400 border border-emerald-500/30">
                                🔬 New: ResNet50 Neural Vision
                            </span>
                            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                                Instant Leaf Disease Diagnosis
                            </h2>
                            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                                Protect your fields from destructive blights, rusts, and viruses.
                                Upload a leaf photo to diagnose infections across 38 crop disease categories,
                                complete with organic and chemical treatment advice.
                            </p>
                            <div className="pt-2 flex flex-wrap gap-3">
                                <Link
                                    to="/disease"
                                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm sm:text-base font-bold text-slate-900 hover:bg-emerald-400 transition hover:scale-105 shadow-lg shadow-emerald-500/20"
                                >
                                    <span>🩺</span> Scan Leaf Now
                                </Link>
                                <Link
                                    to="/crops"
                                    className="inline-flex items-center gap-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 px-5 py-3 text-sm sm:text-base font-semibold text-slate-200 border border-slate-700 transition"
                                >
                                    Browse Supported Crops
                                </Link>
                            </div>
                        </div>

                        <div className="md:col-span-5 flex justify-center">
                            <div className="relative w-full max-w-xs bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 shadow-2xl backdrop-blur-sm">
                                <div className="flex items-center justify-between border-b border-slate-700 pb-3 mb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                                        <span className="text-xs font-bold text-slate-200">AI Plant Doctor</span>
                                    </div>
                                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">
                                        98.4% Acc
                                    </span>
                                </div>
                                <div className="space-y-2.5">
                                    <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/50">
                                        <span className="text-2xl">🍎</span>
                                        <div className="text-xs">
                                            <p className="font-semibold text-white">Apple Scab</p>
                                            <p className="text-emerald-400 text-[10px]">Organic Sulfur Treatment</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/50">
                                        <span className="text-2xl">🌽</span>
                                        <div className="text-xs">
                                            <p className="font-semibold text-white">Corn Common Rust</p>
                                            <p className="text-emerald-400 text-[10px]">Strobilurin / Triazole Controls</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/50">
                                        <span className="text-2xl">🍅</span>
                                        <div className="text-xs">
                                            <p className="font-semibold text-white">Tomato Bacterial Spot</p>
                                            <p className="text-emerald-400 text-[10px]">Copper Hydroxide Spray</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </section>
            
            {/* CTA Section */}
            <motion.section 
                initial={{ opacity: 0, scale: 0.95, y: 40 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="mx-auto mt-24 mb-16 w-full max-w-5xl px-4 sm:px-6 lg:px-8 text-center"
            >
                <div className="relative overflow-hidden rounded-3xl bg-green-600 px-6 py-16 shadow-2xl sm:p-20">
                    {/* Decorative Background Elements */}
                    <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-green-500 opacity-50 blur-3xl"></div>
                    <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-green-700 opacity-50 blur-3xl"></div>
                    
                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
                            Ready to optimize your harvest?
                        </h2>
                        <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-green-100">
                            Get instant, AI-driven crop recommendations based on your unique soil and environmental conditions.
                        </p>
                        <div className="mt-10 flex justify-center">
                            <Link
                                to="/recommend"
                                className="group flex items-center justify-center gap-3 rounded-xl bg-white px-8 py-4 text-lg font-bold text-green-700 shadow-md transition-all hover:-translate-y-1 hover:bg-slate-50 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-green-300"
                            >
                                Start Recommendation
                                <span className="transition-transform group-hover:translate-x-1">→</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </motion.section>

        </main>
    );
}

export default Home;