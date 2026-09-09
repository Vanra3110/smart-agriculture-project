function RecommendationResult({ result }) {
    if (!result) {
        return null;
    }

    const crop = result.data.crop;
    const confidence = result.data.confidence;
    const explanation = result.data.explanation;

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
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

                <p className="text-sm font-semibold tracking-widest text-green-600">
                    AI RECOMMENDATION
                </p>

                <h2 className="mt-3 text-4xl font-bold capitalize text-slate-900">
                    {crop}
                </h2>

                {/* Confidence */}
                <div className="mt-8">

                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-600">
                            Model Confidence
                        </span>

                        <span className="font-bold text-slate-900">
                            {confidencePercentage.toFixed(2)}%
                        </span>
                    </div>

                    <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                            className="h-full rounded-full bg-green-500 transition-all duration-700"
                            style={{
                                width: `${confidencePercentage}%`,
                            }}
                        />
                    </div>

                    <p className="mt-2 text-sm text-slate-500">
                        Confidence Level:{" "}
                        <span className="font-semibold text-slate-700">
                            {confidenceLevel}
                        </span>
                    </p>
                </div>

                {/* Gemini explanation */}
                <div className="mt-8 border-t border-slate-100 pt-6">

                    <h3 className="text-xl font-semibold text-slate-900">
                        🤖 AI Explanation
                    </h3>

                    <p className="mt-3 whitespace-pre-line leading-7 text-slate-600">
                        {explanation}
                    </p>

                </div>

                {/* Disclaimer */}
                <div className="mt-8 rounded-2xl bg-slate-50 p-4">

                    <p className="text-sm leading-6 text-slate-500">
                        This recommendation is generated using an AI
                        model and should be considered as guidance.
                        Actual crop suitability may depend on local
                        soil, weather, irrigation, and farming
                        conditions.
                    </p>

                </div>

            </div>
        </section>
    );
}

export default RecommendationResult;