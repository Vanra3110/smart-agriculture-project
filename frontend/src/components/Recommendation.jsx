import { motion } from "motion/react";
import ReactMarkdown from "react-markdown";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

function RecommendationResult({ result }) {
    if (!result) {
        return null;
    }

    const crop = result.data.crop;
    const confidence = result.data.confidence;
    const explanation = result.data.explanation;
    const probabilities = result.data.probabilities || [];
    
    // Sort probabilities highest to lowest
    const sortedProbabilities = [...probabilities].sort((a, b) => b.probability - a.probability);

    const confidencePercentage = confidence * 100;

    let confidenceLevel;

    if (confidencePercentage >= 70) {
        confidenceLevel = "High";
    } else if (confidencePercentage >= 40) {
        confidenceLevel = "Moderate";
    } else {
        confidenceLevel = "Low";
    }

    return (
        <section className="mx-auto mt-8 w-full max-w-4xl">

            <motion.div 
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: { opacity: 0 },
                    visible: {
                        opacity: 1,
                        transition: { delayChildren: 0.1, staggerChildren: 0.15 }
                    }
                }}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
            >

                <motion.p variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="text-sm font-semibold tracking-widest text-green-600">
                    AI RECOMMENDATION
                </motion.p>

                <motion.h2 variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }} className="mt-3 text-4xl font-bold capitalize text-slate-900">
                    {crop}
                </motion.h2>

                {/* Confidence */}
                <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }} className="mt-8">

                    <div className="flex items-center justify-between">

                        <span className="text-sm font-medium text-slate-600">
                            Model Confidence
                        </span>

                        <span className="font-bold text-slate-900">
                            {confidencePercentage.toFixed(2)}%
                        </span>

                    </div>

                    <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-slate-100">

                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${confidencePercentage}%` }}
                            transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
                            className="h-full rounded-full bg-green-500"
                        />

                    </div>

                    <p className="mt-2 text-sm text-slate-500">
                        Confidence Level:{" "}
                        <span className="font-semibold text-slate-700">
                            {confidenceLevel}
                        </span>
                    </p>

                </motion.div>

                {/* AI Explanation */}
                <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }} className="mt-8 border-t border-slate-100 pt-6">

                    <h3 className="text-xl font-semibold text-slate-900">
                        🤖 AI Explanation
                    </h3>

                    <div className="mt-4 leading-7 text-slate-600">
                        <ReactMarkdown
                            components={{
                                p: ({node, ...props}) => <p className="mb-4 last:mb-0" {...props} />,
                                ul: ({node, ...props}) => <ul className="mb-4 list-disc pl-5" {...props} />,
                                ol: ({node, ...props}) => <ol className="mb-4 list-decimal pl-5" {...props} />,
                                li: ({node, ...props}) => <li className="mb-1" {...props} />,
                                h1: ({node, ...props}) => <h1 className="mb-4 text-2xl font-bold text-slate-900" {...props} />,
                                h2: ({node, ...props}) => <h2 className="mb-3 text-xl font-bold text-slate-800" {...props} />,
                                h3: ({node, ...props}) => <h3 className="mb-2 text-lg font-bold text-slate-800" {...props} />,
                                strong: ({node, ...props}) => <strong className="font-semibold text-slate-900" {...props} />,
                            }}
                        >
                            {explanation}
                        </ReactMarkdown>
                    </div>

                </motion.div>

                {/* Probabilities Graph */}
                {sortedProbabilities.length > 0 && (
                    <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }} className="mt-8 border-t border-slate-100 pt-6">
                        <h3 className="text-xl font-semibold text-slate-900 mb-6">
                            📊 Model Probabilities
                        </h3>
                        <p className="text-[11px] text-slate-400 sm:hidden mb-3">
                            👉 Scroll horizontally to explore all crop probabilities
                        </p>
                        <div className="w-full overflow-x-auto pb-2">
                            <div className="min-w-[560px] sm:min-w-full h-[360px] sm:h-[400px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={sortedProbabilities}
                                        margin={{
                                            top: 5,
                                            right: 5,
                                            left: -20,
                                            bottom: 60,
                                        }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                        <XAxis 
                                            dataKey="crop" 
                                            angle={-45} 
                                            textAnchor="end"
                                            tick={{ fill: '#64748B', fontSize: 12, textTransform: 'capitalize' }}
                                            tickMargin={10}
                                            interval={0}
                                            height={80}
                                        />
                                        <YAxis 
                                            tick={{ fill: '#64748B', fontSize: 12 }}
                                            tickFormatter={(value) => `${value}%`}
                                            domain={[0, 100]}
                                        />
                                        <Tooltip 
                                            cursor={{ fill: '#F8FAFC' }}
                                            contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            formatter={(value) => [`${value}%`, 'Probability']}
                                            labelStyle={{ fontWeight: 'bold', color: '#0F172A', textTransform: 'capitalize', marginBottom: '8px' }}
                                        />
                                        <Bar 
                                            dataKey="probability" 
                                            fill="#22C55E" 
                                            radius={[4, 4, 0, 0]}
                                            animationDuration={1500}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Disclaimer */}
                <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }} className="mt-8 rounded-2xl bg-slate-50 p-4">

                    <p className="text-sm leading-6 text-slate-500">
                        This recommendation is generated using an AI
                        model and should be considered as guidance.
                        Actual crop suitability may depend on local
                        soil, weather, irrigation, and farming
                        conditions.
                    </p>

                </motion.div>

            </motion.div>

        </section>
    );
}

export default RecommendationResult;