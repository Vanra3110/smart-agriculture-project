function RecommendationResult({ result }) {
    if (!result) {
        return null;
    }

    const crop = result.data.crop;
    const confidence = result.data.confidence;

    return (
        <div className="result-card">
            <p className="result-label">
                Recommended Crop
            </p>

            <h2>{crop}</h2>

            <p>
                Model Confidence:{" "}
                <strong>
                    {(confidence * 100).toFixed(2)}%
                </strong>
            </p>
        </div>
    );
}

export default RecommendationResult;