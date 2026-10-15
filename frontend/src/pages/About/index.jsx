import { motion } from "motion/react";

function About() {
    return (
        <main className="min-h-screen bg-slate-50 px-4 pt-16 pb-10 sm:px-6 lg:px-8">

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
                className="mx-auto max-w-4xl"
            >

                <motion.p variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }} className="text-sm font-bold tracking-widest text-green-600">
                    ABOUT THE PROJECT
                </motion.p>

                <motion.h1 variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }} className="mt-3 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                    Smart Agriculture AI
                </motion.h1>

                <motion.p variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }} className="mt-6 text-lg leading-8 text-slate-600">
                    Smart Agriculture AI is a machine-learning based
                    application that recommends suitable crops based
                    on soil and environmental conditions.
                </motion.p>

                <motion.div 
                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                    className="mt-10 grid gap-6 sm:grid-cols-2"
                >

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="text-xl font-semibold text-slate-900">
                            🌱 Machine Learning
                        </h2>

                        <p className="mt-3 leading-7 text-slate-600">
                            A Random Forest classification model analyzes
                            soil nutrients and environmental conditions
                            to recommend a suitable crop.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="text-xl font-semibold text-slate-900">
                            🤖 AI Explanation
                        </h2>

                        <p className="mt-3 leading-7 text-slate-600">
                            A Gemini-based AI assistant provides a simple
                            explanation of why the recommended crop may
                            be suitable for the given conditions.
                        </p>
                    </div>

                </motion.div>

                <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                    <h2 className="text-xl font-semibold text-slate-900">
                        ⚠️ Important
                    </h2>

                    <p className="mt-3 leading-7 text-slate-600">
                        The recommendation is an AI-based prediction and
                        should be treated as guidance. Actual crop
                        suitability can depend on local soil conditions,
                        weather, irrigation, farming practices, and
                        other agricultural factors.
                    </p>

                </motion.div>

            </motion.section>

        </main>
    );
}

export default About;